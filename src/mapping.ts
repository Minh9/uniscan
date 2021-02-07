import { BigInt } from "@graphprotocol/graph-ts"
import {
  Contract,
  Approval,
  MinterAdded,
  MinterRemoved,
  NewOwnership,
  NewPendingOwnership,
  Transfer
} from "../generated/Contract/Contract"
import { Account } from "../generated/schema"

function loadOrCreateAcccount(address:string):Account {
  let account =Account.load(address);
  if(!account==null){
    account = new Account(address);
    account.balance = BigInt.fromI32(0)

  }
  return account as Account;
}
export function handleTransfer(event: Transfer): void {
  let addresFrom = event.params.from.toHexString()
  let addressTo = event.params.to.toHexString()
  let value = event.params.value

  let isMinting=addresFrom =='0x0000000000000000000000000000000000000'
  let isBurning =addressTo =='0x00000000000000000000000000000000000'

  if (!isMinting)
  {
    let accountFrom = loadOrCreateAcccount(addresFrom)
    accountFrom.balance= accountFrom.balance.minus(value)
    accountFrom.save()
  }

  if(!isBurning)
  {
    let accountTo=loadOrCreateAcccount(addressTo)
    accountTo.balance=accountTo.balance.plus(value)
    accountTo.save()
  }

}
