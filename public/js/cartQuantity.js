document.getElementById('quantitySelect').addEventListener('change', function() {
    var selectedValue = this.value;
    document.getElementById('myForm').action = "/user/cart/" + selectedValue;
});