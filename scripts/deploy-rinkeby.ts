import { ethers } from 'hardhat';

const YangNFT = '0xbB7F54758979166A34C40788Ed45796b0569aFD9';
const Governance = '0x5a0350846f321524d0fBe0C6A94027E89bE23bE5';
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
        Governance
    );
    await CHIManager.deployed();

    console.log('CHIVaultDeployer:')
    console.log(CHIDeployer.address) // 0xb5887063F147388Ee24E7632D39EDc6ACE00d38a
    console.log(CHIDeployer.deployTransaction.hash);

    console.log('CHIManager')
    console.log(CHIManager.address) // 0x7A31381D00c2e107716dde41Dbd724240521Dad3
    console.log(CHIManager.deployTransaction.hash);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
