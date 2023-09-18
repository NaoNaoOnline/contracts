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

### Debugging

```
import "hardhat/console.sol";
```



[ACLs]: https://en.wikipedia.org/wiki/Access-control_list
[RBAC]: https://en.wikipedia.org/wiki/Role-based_access_control
