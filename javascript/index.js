async function homePageImagesCategory() {
    try {
        const response = await fetch("http://localhost:8080/homepage/images");

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Assuming the response is an array of objects with category, count, and image for each category
        data.forEach(category => {
            const categoryId = category.categoryname;  // Assuming each category has a unique ID
            const count = category.count;
            const base64Image = category.image;

            if (!base64Image) {
                throw new Error("Image data is missing.");
            }

            // Set the count text
            const countElement = document.getElementById(`${categoryId}-count`);
            if (countElement) {
                countElement.textContent = `${count} items`; // Update the count for the category
            }

            // Set the background image dynamically
            const categoryElement = document.getElementById(categoryId);
            if (categoryElement) {
                categoryElement.style.backgroundImage = `url(data:image/jpg;base64,${base64Image})`;
            }
        });

    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("count").textContent = "Failed to fetch data.";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.getElementById("product-gallery");
    function fetchProducts(filter = "") {
        fetch(`http://localhost:8080/newproduct/details?categories=${filter}`)
            .then(response => response.json())
            .then(data => {
                gallery.innerHTML = ''; 
                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(product => {
                        let productDiv = document.createElement('div');
                        productDiv.classList.add('col-lg-3', 'col-md-4', 'col-sm-6');
                        productDiv.classList.add(product.categoryname); 

                        let imageSrc = product.image && product.image.startsWith('data:image/')
                            ? product.image
                            : `data:image/jpg;base64,${product.image || ''}`;

                        productDiv.innerHTML = `
                            <div class="product__item">
                                <div class="product__item__pic set-bg" style="background-image: url(${imageSrc});">
                                    <ul class="product__hover">
                                        <li><a href="${imageSrc}" class="image-popup"><span class="arrow_expand"></span></a></li>
                                        <li><a href="#"><span class="icon_heart_alt"></span></a></li>
                                        <li><a href="#"><span class="icon_bag_alt"></span></a></li>
                                    </ul>
                                </div>
                                <div class="product__item__text">
                                    <h6>${product.productname}</h6>
                                    <p>Price: ${product.price}</p>
                                </div>
                            </div>
                        `;
                        gallery.appendChild(productDiv);
                    });
                } else {
                    gallery.innerHTML = '<p>No products found for this category.</p>';
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    document.querySelectorAll('.filter__controls li').forEach((button) => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            fetchProducts(filter === '*' ? '' : filter); 
        });
    });

    
    fetchProducts(); 
});

document.addEventListener("DOMContentLoaded", function () {
    fetchAllProducts();
});

function fetchAllProducts() {
    const categories = ["hotTrend", "bestSeller", "featured"];
    
    categories.forEach(category => {
        fetch(`http://localhost:8080/api/products/trending?trendProductName=${category}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                let html = "";
                data.forEach(product => {
                    html += `
                        <div class="trend__item">
                            <div class="trend__item__pic">
                                <img src="data:image/png;base64,${product.image}" alt="${product.productName}">
                            </div>
                            <div class="trend__item__text">
                                <h6>${product.productName}</h6>
                                <div class="product__price">₹ ${product.price}</div>
                            </div>
                        </div>
                    `;
                });
                document.getElementById(category).innerHTML = html;
            })
            .catch(error => console.error(`Error fetching ${category} products:`, error));
    });
}
