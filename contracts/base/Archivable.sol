// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.6;

import "@openzeppelin/contracts/utils/Context.sol";


/**
 * @dev Contract module which allows children to implement an emergency stop
 * mechanism that can be triggered by an authorized account.
 *
 * This module is used through inheritance. It will make available the
 * modifiers `whenNotarchived` and `whenarchived`, which can be applied to
 * the functions of your contract. Note that they will not be Archivable by
 * simply including this module, only once the modifiers are put in place.
 */
abstract contract Archivable is Context {
    /**
     * @dev Emitted when the archive is triggered by `account`.
     */
    event Archived(address account);

    /**
     * @dev Emitted when the archive is lifted by `account`.
     */
    event Unarchived(address account);

    bool private _archived;

    /**
     * @dev Initializes the contract in unarchived state.
     */
    constructor () {
        _archived = false;
    }

    /**
     * @dev Returns true if the contract is archived, and false otherwise.
     */
    function archived() public view virtual returns (bool) {
        return _archived;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is not archived.
     *
     * Requirements:
     *
     * - The contract must not be archived.
     */
    modifier whenNotArchived() {
        require(!archived(), "Archivable: archived");
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is archived.
     *
     * Requirements:
     *
     * - The contract must be archived.
     */
    modifier whenArchived() {
        require(archived(), "Archivable: not archived");
        _;
    }

    /**
     * @dev Triggers stopped state.
     *
     * Requirements:
     *
     * - The contract must not be archived.
     */
    function _archive() internal virtual whenNotArchived {
        _archived = true;
        emit Archived(_msgSender());
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     *
     * - The contract must be archived.
     */
    function _unarchive() internal virtual whenArchived {
        _archived = false;
        emit Unarchived(_msgSender());
    }
}
