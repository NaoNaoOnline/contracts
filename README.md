# contracts

Smart contracts of the NaoNao platform. The current core is the Policy contract,
which is based on the concept of SMAs (system-member-access). SMAs are
contextual permission records, enforcing flat organizational structures without
any capability of inheritance.

```js
/// @notice System refers to context, resource or scope.
/// @notice Member refers to account, identity or user.
/// @notice Access refers to level, permission or role.
```

SMAs are a form of [ACLs] (access control lists) and are similar to [RBAC] (role
based access control). In principle there can be many systems with many members
who each have a certain level of access within their respective systems.

Using SMAs, permission models can be bootstrapped and managed onchain. And since
those permissions are onchain, they are out of band from the point of view of
the apps that use those permissions. That means that if the app using onchain
permissions fails critically, its permission state remains intact and rebooting
the app itself becomes an easier task.

![Clause](/assets/sma.svg)



### Tests

```
npm run test
```



### Development

For historic reasons the contracts have been tested in typescript using Hardhat.
For local deployment it is advisable to run an Anvil node. Please install the
[Foundry] toolbox and run the Anvil node locally.

```
anvil
```

```
                             _   _
                            (_) | |
      __ _   _ __   __   __  _  | |
     / _` | | '_ \  \ \ / / | | | |
    | (_| | | | | |  \ V /  | | | |
     \__,_| |_| |_|   \_/   |_| |_|

    0.2.0 (dbd935b 2023-10-17T00:32:29.831754000Z)
    https://github.com/foundry-rs/foundry
```

The policy contract can be deployed using the Hardhat script on any local node.

```
npx hardhat run --network localhost scripts/deploy_policy.ts
```

```
Policy contract deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

The current state of policy records can be looked up using the HArdhat script on
any local node.

```
npx hardhat run --network localhost scripts/search_policy.ts
```

```
Blocks before iteration 7

   0 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 0
   1 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 0
   1 0x6591C0Ee99D48b43a2c84Da284DB7A526C2dAfE0 1
   2 0x6591C0Ee99D48b43a2c84Da284DB7A526C2dAfE0 0

Blocks after iteration 7
```

The subscription contract can be deployed using the Hardhat script on any local
node.

```
npx hardhat run --network localhost scripts/deploy_subscription.ts
```

```
Subscription contract deployed to 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

The available accounts can also be printed using the Hardhat script on any local
node.

```
npx hardhat run scripts/accounts.ts
```

```
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
0x70997970C51812dc3A010C7d01b50e0d17dc79C8
0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
...
```



### Debugging

```
import "hardhat/console.sol";
```



[ACLs]: https://en.wikipedia.org/wiki/Access-control_list
[Foundry]: https://github.com/foundry-rs/foundry
[RBAC]: https://en.wikipedia.org/wiki/Role-based_access_control
