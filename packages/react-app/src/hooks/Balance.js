import { useState } from 'react'
import usePoller from './Poller'

export default function useBalance(provider, address) {
  const [balance, setBalance] = useState()

  const pollBalance = async () => {
    if (address && provider) {
      const newBalance = await provider.getBalance(address)
      if (newBalance !== balance) {
        setBalance(newBalance)
      }
    }
  }
  usePoller(pollBalance, 27777, address && provider)

  return balance
}
