document.getElementById("productsrow").addEventListener("change", function () {
    const selectedValue = parseInt(this.value);
    const activeFilter = document.querySelector(".filter_cards li.active")?.getAttribute("data-filter") || "All";
    loadProducts(activeFilter, selectedValue, 1); // Load from page 1
});

document.querySelectorAll('.filter_cards li').forEach((button) => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.filter_cards li').forEach(li => li.classList.remove("active"));
        button.classList.add("active");

        const filter = button.getAttribute('data-filter');
        const productsPerRow = parseInt(document.getElementById("productsrow").value) || 4;
        
        loadProducts(filter, productsPerRow, 1); // Reset to page 1 when filtering
    });
});

document.addEventListener("DOMContentLoaded", function () {
    loadProducts("All", 4, 1); // Load default view (4 per row, page 1)
});

function loadProducts(category, productsPerRow, page) {
    let url = category === "All"
        ? "http://localhost:8080/api/products/shopping/all"
        : `http://localhost:8080/api/products/shopping/filter?category=${encodeURIComponent(category)}`;

    fetch(url)
        .then(response => response.json())
        .then(products => {
            let productContainer = document.getElementById("product-container");
            let paginationContainer = document.getElementById("pagination");
            productContainer.innerHTML = "";
            paginationContainer.innerHTML = "";

            // Pagination Logic
            const productsPerPage = 12; // Show 12 products per page
            const totalPages = Math.ceil(products.length / productsPerPage);
            const startIndex = (page - 1) * productsPerPage;
            const selectedProducts = products.slice(startIndex, startIndex + productsPerPage);

            selectedProducts.forEach(product => {
                let productHTML = `
                    <div class="product__item col-${Math.floor(12 / productsPerRow)}">
                        <div class="product__item__pic">
                            <img src="data:image/png;base64,${product.imageBase64}" alt="${product.name}" class="product-image">
                        </div>
                        <div class="product__item__text">
                            <h6><a href="#">${product.name}</a></h6>
                            <div class="product__price">₹ ${product.price}</div>
                        </div>
                    </div>
                `;
                productContainer.innerHTML += productHTML;
            });

            
            if (selectedProducts.length === 0) {
                productContainer.innerHTML = `<p>No products found.</p>`;
            }

            if (totalPages > 1) {
                for (let i = 1; i <= totalPages; i++) {
                    let pageButton = document.createElement("button");
                    pageButton.innerText = i;
                    pageButton.classList.add("page-btn");
                    if (i === page) pageButton.classList.add("active");
                    pageButton.addEventListener("click", () => loadProducts(category, productsPerRow, i));
                    paginationContainer.appendChild(pageButton);
                }
            }

           
            document.getElementById("product-count").innerText = `Showing ${selectedProducts.length} of ${products.length} products`;
        })
        .catch(error => console.error("Error loading products:", error));
}
