let user = {
  salt: '200.dDCNpGoTmyNPOQjTD/Tsh3elZETKCBIpXmc0wHqpfd8=',
  passwordHash: 'Fp17nF7zh2tjPDW4NxSvBh++la/gFzSbAEtm/ij1z0xBWPPVu75dTbtDphTAV3tlB0gscWhqJmZLroVfUKFfA1J/lwyxffkvRYJxpLH9LZ4ZwB9eZMmxp6Ta90B4S+xv8j3r4WELjo2VfN3FgYC4UsDm2ezHSZ8MGCAx0dyVU4Mz9ESh4mb2R3TSEMW5gL9A5JZncgvAgGmhYr18ZrQsCBlcDTiWe91550cJCKk2g9Z9HMtAv2OP4QrmbZK6UlEBwPD2KcG+QK/NFs6dQg4eEqlwwJw4/7HStavyNria1fr36Y94BstaKYvyiLc/1YV3CtBsYitP0jyEGLWOufc4tw=='
};

module.exports = () => {
  return {
    where: () => {
      return {
        then: (cb) => { cb([ user ]); }
      }
    },
    insert: () => {
      return {
        then: (cb) => { cb([ user ]); }
      }
    }
  }
};
