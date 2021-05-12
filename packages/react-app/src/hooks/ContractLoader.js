/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { Contract } from '@ethersproject/contracts'
import axios from 'axios'
import { useState, useEffect } from 'react'

const loadData = async (contractName, type) => {
  try {
    return require(`../contracts/${contractName}.${type}.js`)
  } catch (e) {
    console.log(`Fetching ${contractName} "${type}" data...`)
    const r = await axios(`/contracts-data?name=${contractName}&type=${type}`)
    return r.data
  }
}

const loadContract = async (contractName, signer) => {
  const address = await loadData(contractName, 'address')
  const abi = await loadData(contractName, 'abi')
  const bytecode = await loadData(contractName, 'bytecode')

  const contract = new Contract(address, abi, signer)
  if (bytecode) contract.bytecode = bytecode

  return contract
}

export default function useContractLoader(providerOrSigner) {
  const [contracts, setContracts] = useState()

  useEffect(() => {
    async function loadContracts() {
      if (typeof providerOrSigner !== 'undefined') {
        const contractList = require('../contracts/contracts.js')
        // we need to check to see if this providerOrSigner has a signer or not
        let signer
        let accounts
        if (providerOrSigner && typeof providerOrSigner.listAccounts === 'function') {
          accounts = await providerOrSigner.listAccounts()
        }

        if (accounts && accounts.length > 0) {
          signer = providerOrSigner.getSigner()
        } else {
          signer = providerOrSigner
        }

        const newContracts = {}
        const contractPromises = []
        for (let i = 0; i < contractList.length; i += 1) {
          const contractName = contractList[i]
          contractPromises.push(loadContract(contractName, signer))
        }

        try {
          const results = await Promise.all(contractPromises)
          for (let i = 0; i < results.length; i += 1) {
            const contractName = contractList[i]
            newContracts[contractName] = results[i]
          }

          setContracts(newContracts)
        } catch (e) {
          console.log(`ERROR: Contract ${e} cannot be loaded!`)
        }
      }
    }
    loadContracts()
  }, [providerOrSigner])

  return contracts
}
