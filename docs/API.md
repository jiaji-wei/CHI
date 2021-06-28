# CHI API Documents

## List strategies

```

function chi(uint256 tokenId)
    external
    view
    returns (
        address owner,
        address operator,
        address pool, // 交易池地址
        address vault,  // CHI vault 地址
        uint256 accruedProtocolFees0,  // 累计token0手续费
        uint256 accruedProtocolFees1,  // 累计token1手续费
        uint256 fee, 
        uint256 totalShares  // mint total share
    );
```

```
1. Get MaxTokenId

const maxTokenId = ICHIManager(managerAddr).totalSupply();

2. Traverse tokenId, and use **chi** function get **vault** address.

Use vault address to ICHIVault get token0, token1, and Amount0, Amount1.

for (let idx = 0; idx < maxTokenId; idx++) {
    const chi = ICHIManager(managerAddr).chi(idx);

    const vault: ICHIVault = ICHIVault(chi.vault);

    // token0, token1
    const token0 = vault.token0().symbol;
    const token1 = vault.token1().symbol;

    // range count, and range list
    const rangeCount = vault.getRangeCount();
    for (let _j = 0; _j < rangeCount(); _j++) {
        const {tickLower, tickUpper} = vault.getRange(_j);
    }

    // tvl of token0, token1
    const {totalAmount0, totalAmount1} = vault.getTotalAmounts()
}

```

## Create and Update strategy.
```
// Only Gov can mint chi strategy

function mint(MintParams calldata params)
    external
    override
    onlyGov
    returns (uint256 tokenId, address vault)
{
    address uniswapPool = IUniswapV3Factory(v3Factory).getPool(
        params.token0,
        params.token1,
        params.fee
    );

    require(uniswapPool != address(0), "Non-existent pool");

    vault = ICHIVaultDeployer(deployer).createVault(
        uniswapPool,
        address(this),
        params.vaultFee
    );
    _mint(params.recipient, (tokenId = _nextId++));

    _chi[tokenId] = CHIData({
        operator: params.recipient,
        pool: uniswapPool,
        vault: vault
    });

    emit Create(tokenId, uniswapPool, vault, params.vaultFee);
}

// add, remove range
function addRange(
    uint256 tokenId,
    int24 tickLower,
    int24 tickUpper
) external override isAuthorizedForToken(tokenId) {
    CHIData storage _chi_ = _chi[tokenId];
    ICHIVault(_chi_.vault).addRange(tickLower, tickUpper);
}

function removeRange(
    uint256 tokenId,
    int24 tickLower,
    int24 tickUpper
) external override isAuthorizedForToken(tokenId) {
    CHIData storage _chi_ = _chi[tokenId];
    ICHIVault(_chi_.vault).removeRange(tickLower, tickUpper);
}

function addAndRemoveRanges(
    uint256 tokenId,
    RangeParams[] calldata addRanges,
    RangeParams[] calldata removeRanges
) external override isAuthorizedForToken(tokenId) {
    CHIData storage _chi_ = _chi[tokenId];
    for (uint256 i = 0; i < addRanges.length; i++) {
        ICHIVault(_chi_.vault).addRange(
            addRanges[i].tickLower,
            addRanges[i].tickUpper
        );
    }
    for (uint256 i = 0; i < removeRanges.length; i++) {
        ICHIVault(_chi_.vault).removeRange(
            removeRanges[i].tickLower,
            removeRanges[i].tickUpper
        );
    }
}

```
