// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.1;

contract MedicineManager {
    struct Company {
        string name;
        string addr;
        string id; // Added manufacturer ID
    }
    
    struct Medicine {
        uint256 id;
        string name;
        Company manufacturer;
        uint256 manufacturingDate;
        uint256 expiryDate;
        uint256 mrp;
        uint256 quantity;
        uint256[] temperatures;
        string[] suppliers; // Updated supplier array
    }
    
    Medicine[] public medicines;

    function addMedicine(
        uint256 _id,
        string memory _name,
        string memory _manufacturerName,
        string memory _manufacturerAddress,
        string memory _manufacturerId,
        uint256 _manufacturingDate,
        uint256 _expiryDate,
        uint256 _mrp,
        uint256 _quantity,
        uint256 _temperature
    ) public {
        Company memory manufacturer = Company(_manufacturerName, _manufacturerAddress, _manufacturerId);
        string[] memory suppliers = new string[](1);
        suppliers[0] = _manufacturerId;
        uint256[] memory temperatures = new uint256[](1);
        temperatures[0] = _temperature;
        medicines.push(Medicine({
            id: _id,
            name: _name,
            manufacturer: manufacturer,
            manufacturingDate: _manufacturingDate,
            expiryDate: _expiryDate,
            mrp: _mrp,
            quantity: _quantity,
            temperatures: temperatures,
            suppliers: suppliers
        }));
        emit MedicineAdded(medicines.length - 1);
    }

    function getMedicine(uint256 _id) public view returns (
        uint256 id,
        string memory name,
        string memory manufacturerName,
        string memory manufacturerAddress,
        uint256 manufacturingDate,
        uint256 expiryDate,
        uint256 mrp,
        uint256 quantity,
        uint256[] memory temperatures,
        string[] memory suppliers
    ) {
        for (uint256 i = 0; i < medicines.length; i++) {
            if (medicines[i].id == _id) {
                Medicine memory medicine = medicines[i];
                return (
                    medicine.id,
                    medicine.name,
                    medicine.manufacturer.name,
                    medicine.manufacturer.addr,
                    medicine.manufacturingDate,
                    medicine.expiryDate,
                    medicine.mrp,
                    medicine.quantity,
                    medicine.temperatures,
                    medicine.suppliers
                );
            }
        }
        // return (0, "", "", "", 0, 0, "", 0, "", 0, 0, 0, new string );
    }

    function updateMedicineSupplier(uint256 _id, string memory _supplierId, uint256 _temperature) public {
        for (uint256 i = 0; i < medicines.length; i++) {
            if (medicines[i].id == _id) {
                medicines[i].suppliers.push(_supplierId);
                medicines[i].temperatures.push(_temperature);
                break;
            }
        }
    }

    function getMedicinesBySupplierId(string memory _supplierId) public view returns (uint256[] memory) {
        uint256[] memory matchingMedicineIds = new uint256[](medicines.length);
        uint256 count = 0;
        for (uint256 i = 0; i < medicines.length; i++) {
            if (medicines[i].suppliers.length > 0 && keccak256(abi.encodePacked(medicines[i].suppliers[medicines[i].suppliers.length - 1])) == keccak256(abi.encodePacked(_supplierId))) {
                matchingMedicineIds[count++] = medicines[i].id;
            }
        }
        // Resize the array to remove any empty slots
        assembly {
            mstore(matchingMedicineIds, count)
        }
        return matchingMedicineIds;
    }

    event MedicineAdded(uint256 indexed index);
}
