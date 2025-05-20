import {db,collection,getDocs,addDoc} from './config.js'

   const colRef = collection(db,"shoes");

//    function for editing the size of the photo comming from firebase before inserting in ui to be the same size
   function transformImageUrl(url, width, height) {
        return url.replace('/upload/', `/upload/c_fill,w_${width},h_${height}/`);
    }


//  function for calculating discount

    function calculateDiscount(price,discount){
        let discountPrice=price * discount /100;
        let finalPrice=price -discountPrice;
        return finalPrice;
    }




//    get the data from firebase
    let shoes =[];
   getDocs(colRef)
   .then((snapshot)=>{
        snapshot.docs.forEach((doc)=>{
            shoes.push({...doc.data(),id: doc.id});
        })
    // })


    let noOfProducts=4;                 //change the number of products to appear from here
    createStructureOfCards(noOfProducts);


    // adding event listner on the shopping icon
    for (let i = 0; i < noOfProducts; i++) {
        const shopping = document.getElementById(`shop-${i}`);
        if (shopping) {
          shopping.addEventListener("click", (e) => {
       
        
            let idOfElem = e.target.closest(".icon").id;
            let locOfHifen =idOfElem.indexOf("-") +1;
            addToCart(Number(idOfElem.substring(locOfHifen)),e);
          });
        } else {
          console.error(`Element shop-${i} not found`);
        }
    }
    // adding event listner on the fav icon
    for (let i = 0; i < noOfProducts; i++) {
        const favourite = document.getElementById(`love-${i}`);
        if (favourite) {
            favourite.addEventListener("click", (e) => {

        
            let idOfElem = e.target.closest(".icon").id;
            let locOfHifen =idOfElem.indexOf("-") +1;
            addToFav(Number(idOfElem.substring(locOfHifen)),e);
          });
        } else {
          console.error(`Element love-${i} not found`);
        }
    }

   

    for(let i=0; i<noOfProducts; i++){ 
        const originalUrl = shoes[i].url[0];
        const croppedUrl = transformImageUrl(originalUrl, 300, 300);

        saveOrginalSrcOfCards(croppedUrl,i);  //  saving the source of the photos so when the mouseleave the src of the main photos comeback

        document.getElementById(`previewImage-${i}`).src = croppedUrl;

        for(let j=1; j <shoes[i].url.length; j++){
            const thumbnailsUrl = shoes[i].url[j];
            console.log(thumbnailsUrl);
            
            const thumbnailsCropped = transformImageUrl(thumbnailsUrl, 300, 300);
            document.getElementById(`previewImage-${i}-${j}`).src =thumbnailsCropped;
        }
        document.getElementById(`product-title-${i}`).innerText =shoes[i].title;
     

        document.getElementById(`discount-badge-${i}`).innerText +=`-${shoes[i].discount}%`;

        document.getElementById(`sale-price-${i}`).innerText +=`LE ${calculateDiscount(shoes[i].price,shoes[i].discount)}.00`;
        document.getElementById(`original-price-${i}`).innerText = `LE ${shoes[i].price}.00`;

       
    }

    attachThumbnailHoverEvents();
   })


   function createStructureOfCards(noOfProducts){

        let container =document.getElementById("containerOfCards");
                                        
        for(let i =0; i<noOfProducts; i++){
           
            let card = `
            <div class="card-m">
                <div class="image">
                    <img id="previewImage-${i}" />

                    <div class="action-icons">
                        <div class="icon" id="shop-${i}" ><i class="fa-solid fa-cart-shopping"></i></div>
                        <div class="icon" id="love-${i}"><i class="fa-solid fa-heart"></i></div>
                    </div>
                    <div class="sizes " id="sizes-${i}"></div>

                </div>
                <div class="discount-badge" id="discount-badge-${i}"></div>

                <div class="info">
                    <h3 class="product-title" id="product-title-${i}"></h3>
                    <div class="product-price">
                        <span class="original-price" id="original-price-${i}"></span>
                        <span class="sale-price" id="sale-price-${i}"> </span>
                    </div>
                </div>
                <div class="thumbnail-container" id="thumbnail-container-${i}">
                <div class="pop-up-overlay"></div>
                    <div class="pop-up" id="pop-up-shopping">
                   
                    </div>
                    
                </div>
            </div>
        
            `
            container.innerHTML += card;





            for(let j=1;j<shoes[i].url.length; j++){ // j starts with 1 because 0 is gonna be the main image
                let thumbnailContainer=document.getElementById(`thumbnail-container-${i}`);
                let thumbToAppend = `
                    <img class="thumbnail" id="previewImage-${i}-${j}" >
                `
                thumbnailContainer.innerHTML += thumbToAppend; 

            }
            for(let k=0;k<shoes[i].sizes.length; k++){ 
                let sizesContainer=document.getElementById(`sizes-${i}`);
                let sizeToAppend = `
                    <span class="size-elem" id="size-${i}-${k}"> ${shoes[i].sizes[k]} </span>
                `
                sizesContainer.innerHTML += sizeToAppend; 

            }
            


        
        }
        
       
       
   }


    //  saving the source of the photos so when the mouseleave the src of the main photos comeback
   let savedURL={
   }
   function saveOrginalSrcOfCards(src,id){
        savedURL[id] = src;
   }

   // ---------------------------------------------------------------------------------------------


//    when i hover over the thumbnails it handles it
   function attachThumbnailHoverEvents(){
            const cards = document.querySelectorAll(".card-m");
        
            cards.forEach((card, i) => {
            const targetImage = document.getElementById(`previewImage-${i}`);
            const originalSrc = targetImage.src;
        
            const thumbnailContainer = card.querySelector(".thumbnail-container");
            const thumbnails = thumbnailContainer.querySelectorAll(".thumbnail");
        
            thumbnails.forEach((thumb) => {
                thumb.addEventListener("mouseenter", () => {
                fadeImage(targetImage, thumb.src);
                });
            });
        
            thumbnailContainer.addEventListener("mouseleave", () => {
                fadeImage(targetImage, savedURL[i]);
            });
            });

   }
   
   


//  ------------fade between the images


  function fadeImage(imgElement, newSrc) {

    if (imgElement.src === newSrc) return;
  

    imgElement.classList.add("fade-out");
  
    const onTransitionEnd = () => {
      imgElement.src = newSrc; 
      imgElement.classList.remove("fade-out");
      imgElement.removeEventListener("transitionend", onTransitionEnd);
    };
  
    imgElement.addEventListener("transitionend", onTransitionEnd);
  
    setTimeout(onTransitionEnd, 300);
  }

   // ---------------------------------------------------------------------------------------------






   let cart = new Set();
   let fav =new Set();
  
   function addToCart(id,e) {
        let idOfElement = shoes[id].id;
        popUpMenuForShopping(id,idOfElement);

   }
function addToFav(id, e) {
    const idOfElement = shoes[id].id;
    const iconDiv = e.currentTarget;
    const icon = iconDiv.querySelector("i");

    if (!fav.has(idOfElement)) {
        fav.add(idOfElement);
        iconDiv.classList.add("pressed");
        icon.classList.add("pressed-icon");
    } else {
        fav.delete(idOfElement);
        iconDiv.classList.remove("pressed");
        icon.classList.remove("pressed-icon");
    }

    console.log(fav);
}

    let cartChosen ={};

   function popUpMenuForShopping(idOfElement) {
    document.querySelector('.pop-up').classList.add('open');
    document.querySelector('.pop-up-overlay').classList.add('open');
    addDataToPopup(idOfElement);
    
   }

   
   function addDataToPopup(id,idOfElement){
        let popupContainer = document.getElementById("pop-up-shopping");
   
        let salePrice =calculateDiscount(shoes[id].price,shoes[id].discount);  
        let originalPrice =shoes[id].price;
         let saving = originalPrice - salePrice ;





        let data = `
                <button class="close-btn" id="close-btn-popUp" >×</button>
                <div class="data">
                    <h3 class="product-title-pop" id="product-title-pop-${id}">${shoes[id].title}</h3>

                </div>
                <div class="price">
                        <span class="original-price" id="original-price-pop-${id}">LE${originalPrice}.00</span>
                        <span class="sale-price" id="sale-price-pop-${id}">LE${salePrice}.00 </span>
                </div>
                <div class="savings">SAVE LE${saving}.00</div>
                <span class="colors-label">COLORS AVAILABLE</span>
                <div class="colors-product-pop" id="colors-product-pop">
                       
                </div>
                <div class="color-section" id="color-selection-pop">
                    <div class="size-option">
                        <span class="size-label">SIZES AVAILABLE</span>
                    </div>
                    <div class="sizes" id="sizes-pop-up">
                       
                    </div>
                 
                </div>
                
            
                <button class="add-to-cart" id="add-to-cart-pop">ADD TO CART</button>
               
        
        `;
        popupContainer.innerHTML = data;
        
        let sizesContainer=document.getElementById(`sizes-pop-up`);
        for(let k=0;k<shoes[id].sizes.length; k++){ 
            
            let sizeToAppend = `
                    <div class="size-option"> ${shoes[id].sizes[k]}</div>
    
            `
            sizesContainer.innerHTML += sizeToAppend; 
        
        }
        let colorsContainer =document.getElementById(`colors-product-pop`);
        for(let j=0; j <shoes[id].url.length; j++){
            const thumbnailsUrl = shoes[id].url[j];
            const thumbnailsCropped = transformImageUrl(thumbnailsUrl, 300, 300);

            let imageToappend =`
                <img class="thumbnail-pop" id="previewImage-${id}-${j}" ></img>
            `
            colorsContainer.innerHTML += imageToappend;
            document.getElementById(`previewImage-${id}-${j}`).src =thumbnailsCropped;
        }
        let addingBotton = document.getElementById("add-to-cart-pop");
        addingBotton.addEventListener("click",()=>{
            closePopup();
            cartChosen= shoes[id];
            console.log(cartChosen);
    
        })




        let closeButton = document.getElementById("close-btn-popUp");
        closeButton.addEventListener("click",closePopup);

   }
   function closePopup(){
    document.querySelector('.pop-up').classList.remove('open');
    document.querySelector('.pop-up-overlay').classList.remove('open');
   }



   document.addEventListener('DOMContentLoaded', function() {
    // This will now work because the DOM is fully loaded
    let test = document.getElementsByClassName("form-container-m");
    console.log(test);
    
    // Rest of your existing DOMContentLoaded code...
});

document.addEventListener('DOMContentLoaded', function() {


    // Add new size field
    document.getElementById('addSizeBtn').addEventListener('click', function() {
        const container = document.getElementById('sizesContainer');
        const newSizeItem = document.createElement('div');
        newSizeItem.className = 'size-item-m';
        newSizeItem.innerHTML = `
            <input type="text" name="sizeValue[]" placeholder="Size value (e.g., M)">
            <button type="button" class="remove-btn-m">Remove</button>
        `;
        container.appendChild(newSizeItem);
        
        // Add event listener to the new remove button
        newSizeItem.querySelector('.remove-btn-m').addEventListener('click', function() {
            container.removeChild(newSizeItem);
        });
    });


    // Add new URL field
    document.getElementById('addUrlBtn').addEventListener('click', function() {
        const container = document.getElementById('urlsContainer');
        const newUrlItem = document.createElement('div');
        newUrlItem.className = 'url-item-m';
        newUrlItem.innerHTML = `
            <input type="text" name="urlKey[]" placeholder="URL key (e.g., B)">
            <input type="text" name="urlValue[]" placeholder="Image URL">
            <button type="button" class="remove-btn-m">Remove</button>
        `;
        container.appendChild(newUrlItem);
        
        // Add event listener to the new remove button
        newUrlItem.querySelector('.remove-btn-m').addEventListener('click', function() {
            container.removeChild(newUrlItem);
        });
    });

    // Add event listeners to existing remove buttons
    document.querySelectorAll('#sizesContainer .remove-btn-m').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.size-item-m').remove();
        });
    });

    document.querySelectorAll('#urlsContainer .remove-btn-m').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.url-item-m').remove();
        });
    });

    let submitBtn = document.getElementById("submit-btn-m");
        if (submitBtn) {
            submitBtn.addEventListener("click", function() {

            });
        }
})

document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
 
    const formData = {
        title: document.getElementById('title').value,
        discount: document.getElementById('discount').value,
        price: document.getElementById('price').value,
        sizes: [],
        urls: []
    };

    // Collect sizes
    document.querySelectorAll('#sizesContainer .size-item-m').forEach(item => {
        const value = item.querySelector('input[name="sizeValue[]"]').value;
        if (value) {
            formData.sizes.push(value) ;
        }
    });

    // Collect URLs
    document.querySelectorAll('#urlsContainer .url-item-m').forEach(item => {
        const key = item.querySelector('input[name="urlKey[]"]').value;
        const value = item.querySelector('input[name="urlValue[]"]').value;
        if (key && value) {
            formData.urls[key] = value;
        }
    });

    addDoc(colRef,formData)
    .then(()=>{
        productForm.reset();
    })
  
});


 



















