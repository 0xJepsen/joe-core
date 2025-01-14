module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  let joeAddress,
    veJoeAddress = (await deployments.get("VeJoeToken")).address,
    veJoePerSharePerSec = 3170979198376,
    speedUpVeJoePerSharePerSec = 3170979198376,
    speedUpThreshold = 5,
    speedUpDuration = 15 * 60 * 60 * 24,
    maxCapPct = 10000;

  const chainId = await getChainId();
  if (chainId == 4) {
    // rinkeby contract addresses
    joeAddress = ethers.utils.getAddress(
      "0xce347E069B68C53A9ED5e7DA5952529cAF8ACCd4"
    );
  } else if (chainId == 43114 || chainId == 31337) {
    // avalanche mainnet or hardhat network addresses
    joeAddress = ethers.utils.getAddress(
      "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd"
    );
  }

  const stableJoeStaking = await deploy("VeJoeStaking", {
    from: deployer,
    proxy: {
      proxyContract: "OpenZeppelinTransparentProxy",
      execute: {
        init: {
          methodName: "initialize",
          args: [
            joeAddress,
            veJoeAddress,
            veJoePerSharePerSec,
            speedUpVeJoePerSharePerSec,
            speedUpThreshold,
            speedUpDuration,
            maxCapPct,
          ],
        },
      },
    },
    log: true,
  });
};

module.exports.tags = ["VeJoeStaking"];
module.exports.dependencies = ["VeJoeToken"];
