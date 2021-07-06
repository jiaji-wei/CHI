import { ethers } from 'hardhat';

const YangNFT = '0xd1309B94DAcA28bc402694a60Aee53089cfff5E5';
const MerkleRoot = '0xdb45131226a82a3ac77bac89d823bed43d130e9cb50cd0f03c84f6d28264a78f';
const UniV3Factory = '0x1F98431c8aD98523631AE4a59f267346ea31F984';


async function main() {
    const CHIDeployerFactory = await ethers.getContractFactory('CHIVaultDeployer');
    const CHIManagerFactory = await ethers.getContractFactory('CHIManager');
    const CHIDeployer = await CHIDeployerFactory.deploy();
    await CHIDeployer.deployed();

    const CHIManager = await CHIManagerFactory.deploy(
        UniV3Factory,
        YangNFT,
        CHIDeployer.address,
        MerkleRoot
    );
    await CHIManager.deployed();

    console.log('CHIVaultDeployer:')
    console.log(CHIDeployer.address) // 0x7eE5DaE59b06F8174D6Fd043dBC7e894b38D4860
    console.log(CHIDeployer.deployTransaction.hash);

    console.log('CHIManager')
    console.log(CHIManager.address) // 0x53CcaFA63368BD8D5162e00Ff116c2F6626944A4
    console.log(CHIManager.deployTransaction.hash);

    await CHIDeployer.setCHIManager(CHIManager.address)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
