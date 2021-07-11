import { ethers } from 'hardhat';

const YangNFT = '0x361582386541F9Bc612DB75b4270A1712e389F0e';
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
    console.log(CHIDeployer.address) // 0xC89C160E129228709f485Bbdd2772370650eFDce
    console.log(CHIDeployer.deployTransaction.hash);

    console.log('CHIManager')
    console.log(CHIManager.address) // 0x080c0D0d3C076eF04337300B87fb06D6457b7b82
    console.log(CHIManager.deployTransaction.hash);

    await CHIDeployer.setCHIManager(CHIManager.address)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
