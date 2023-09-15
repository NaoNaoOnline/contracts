// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";
import "@ethereum-attestation-service/eas-contracts/contracts/resolver/SchemaResolver.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

/// @title RoleResolver For EAS Schemas
/// @author xh3b4sd
/// @notice RoleResolver is a RBAC based schema resolver for EAS attestation and revocation.
contract RoleResolver is SchemaResolver {
    ///
    /// EVENTS
    ///

    /// @notice RoleGranted is emitted when `sen` granted `rol` to `acc`.
    event RoleGranted(
        Role indexed rol,
        address indexed acc,
        address indexed sen
    );

    /// @notice RoleRevoked is emitted when `sen` revoked `rol` from `acc`.
    event RoleRevoked(
        Role indexed rol,
        address indexed acc,
        address indexed sen
    );

    ///
    /// MODIFIERS
    ///

    /// @notice TODO
    modifier onlyAdmin(address acc) {
        require(
            isAdmin(acc),
            string(
                abi.encodePacked(
                    Strings.toHexString(msg.sender),
                    " does not have ROLE_ADMIN"
                )
            )
        );

        _;
    }

    /// @notice TODO
    modifier onlyNotAdmin(address acc) {
        require(
            !isAdmin(acc),
            string(
                abi.encodePacked(
                    Strings.toHexString(msg.sender),
                    " does already have ROLE_ADMIN"
                )
            )
        );

        _;
    }

    /// @notice TODO
    modifier onlyMdrtr(address acc) {
        require(
            isMdrtr(acc),
            string(
                abi.encodePacked(
                    Strings.toHexString(msg.sender),
                    " does not have ROLE_MDRTR"
                )
            )
        );

        _;
    }

    /// @notice TODO
    modifier onlyNotMdrtr(address acc) {
        require(
            !isMdrtr(acc),
            string(
                abi.encodePacked(
                    Strings.toHexString(msg.sender),
                    " does already have ROLE_MDRTR"
                )
            )
        );

        _;
    }

    /// @notice TODO
    modifier onlyAdminOrMdrtr(address acc) {
        require(
            isAdmin(acc) || isMdrtr(acc),
            string(
                abi.encodePacked(
                    Strings.toHexString(msg.sender),
                    " does neither have ROLE_ADMIN nor ROLE_MDRTR"
                )
            )
        );

        _;
    }

    ///
    /// ROLES
    ///

    enum Role {
        MDRTR,
        ADMIN
    }

    /// @notice ROLE_ADMIN is the administrator role with full control over all contract functionality.
    Role public constant ROLE_ADMIN = Role.ADMIN;
    /// @notice ROLE_MDRTR is the moderator role allowed to attest and revoke.
    Role public constant ROLE_MDRTR = Role.MDRTR;

    using EnumerableSet for EnumerableSet.AddressSet;

    /// @notice _roles is the internal mapping between roles and their respective accounts.
    mapping(Role => EnumerableSet.AddressSet) private _roles;

    ///
    /// CONSTRUCTOR
    ///

    /// @notice constructor creates a new instance of the RoleResolver contract.
    /// @notice At contract creation, msg.sender is granted the admin role.
    /// @param eas the address of the EAS contract to adapt and override.
    constructor(IEAS eas) SchemaResolver(eas) {
        _roles[ROLE_ADMIN].add(msg.sender);
    }

    ///
    /// OVERRIDES
    ///

    /// @notice onAttest verifies whether the attester address of the given attestation has the moderator role.
    /// @notice If onAttest returns false, the given attestation is rejected.
    /// @param att the attestion to verify.
    function onAttest(
        Attestation calldata att,
        uint256 /*value*/
    ) internal view override returns (bool) {
        return isMdrtr(att.attester);
    }

    /// @notice onRevoke verifies whether the attester address of the given revocation has the moderator role.
    /// @notice If onRevoke returns false, the given revocation is rejected.
    /// @param rev the revocation to verify.
    function onRevoke(
        Attestation calldata rev,
        uint256 /*value*/
    ) internal view override returns (bool) {
        return isMdrtr(rev.attester);
    }

    ///
    /// PUBLIC
    ///

    /// @notice grantAdmin enables `msg.sender` to grant `acc` the given `rol`.
    /// @notice If `acc` has `rol` already, then grantAdmin reverts.
    /// @notice If `msg.sender` does not have the administrator itself, then grantAdmin reverts.
    function grantAdmin(
        address acc
    ) public onlyNotAdmin(acc) onlyAdmin(msg.sender) {
        _roles[ROLE_ADMIN].add(acc);
        emit RoleGranted(ROLE_ADMIN, acc, msg.sender);
    }

    /// @notice TODO
    function grantMdrtr(
        address acc
    ) public onlyNotMdrtr(acc) onlyAdminOrMdrtr(msg.sender) {
        _roles[ROLE_MDRTR].add(acc);
        emit RoleGranted(ROLE_MDRTR, acc, msg.sender);
    }

    /// @notice TODO
    function revokeAdmin(
        address acc
    ) public onlyAdmin(acc) onlyAdmin(msg.sender) {
        _roles[ROLE_ADMIN].remove(acc);
        emit RoleRevoked(ROLE_ADMIN, acc, msg.sender);
    }

    /// @notice TODO
    function revokeMdrtr(
        address acc
    ) public onlyMdrtr(acc) onlyAdminOrMdrtr(msg.sender) {
        _roles[ROLE_MDRTR].remove(acc);
        emit RoleRevoked(ROLE_MDRTR, acc, msg.sender);
    }

    ///
    /// VIEW
    ///

    /// @notice isAdmin returns `true` if `acc` has been granted the moderator role.
    function isAdmin(address acc) public view returns (bool) {
        return _hasRole(ROLE_ADMIN, acc);
    }

    /// @notice isMdrtr returns `true` if `acc` has been granted the moderator role.
    function isMdrtr(address acc) public view returns (bool) {
        return _hasRole(ROLE_MDRTR, acc);
    }

    /// @notice TODO
    function listAdmins() public view returns (address[] memory) {
        return _roles[ROLE_ADMIN].values();
    }

    /// @notice TODO
    function listMdrtr() public view returns (address[] memory) {
        return _roles[ROLE_MDRTR].values();
    }

    ///
    /// INTERNAL
    ///

    /// @notice _hasRole returns `true` if `acc` has `rol`.
    function _hasRole(Role rol, address acc) internal view returns (bool) {
        return _roles[rol].contains(acc);
    }
}
