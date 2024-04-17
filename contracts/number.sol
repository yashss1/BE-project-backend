// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.1;

contract samStorage {
    uint256 number1;

    /**
     * @dev Store value in variable
     * @param num value to store
     */
    function store(uint256 num) public {
        number1 = num;
    }

    /**
     * @dev Return value
     * @return value of 'number'
     */
    function retrieve() public view returns (uint256) {
        return number1;
    }
}
