let allLikeButtons = document.querySelectorAll('.like-btn');

for(let btn of allLikeButtons){
    btn.addEventListener('click', () => {
        let product_id = btn.getAttribute('product_id');
        likeButtons(product_id, btn);
    })
}

async function likeButtons(productId, btn){
    try{
        let response = await axios({
            method: 'post', 
            url: `/products/${productId}/like`,
            headers : {'X-Requested-With' : 'XMLHttpRequest'}
        })
        // console.log(btn)
        // console.log(response);
        if(btn.children[0].classList.contains('fa-regular')){
            // console.log("bina rang")
            btn.children[0].classList.remove('fa-regular')
            btn.children[0].classList.add('fa-solid')
        }else{
            // console.log("rang ke saath")
            btn.children[0].classList.remove('fa-solid')
            btn.children[0].classList.add('fa-regular')
        }

    }
    catch(e){
        if(e.response.status === 401){

            window.location.replace('/login');
            console.log(e.message , 'error hai ye window vaali line ka')
        }
    }
}