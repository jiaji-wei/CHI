import { ethers } from 'hardhat';

const YangNFT = '0x0E1d4ac1F1858135b02F64CF6d47caEa5B218BAA';
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
    console.log(CHIDeployer.address) // 0xd5C3B2e0B466601E2cCFC2f5D5A2E1e3d0950074
    console.log(CHIDeployer.deployTransaction.hash);

    console.log('CHIManager')
    console.log(CHIManager.address) // 0x7BA99E11f8A5bF1ca086B38795F852B9564D65E1
    console.log(CHIManager.deployTransaction.hash);

    await CHIDeployer.setCHIManager(CHIManager.address)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
