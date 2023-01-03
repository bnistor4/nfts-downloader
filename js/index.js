(function ($) {
  "use strict";
  $(document).ready(function () {
    var address = "";
    var imagesArray = [];
    var collectionName = "";
    $(".alert-danger").hide();
    $(".get-download").hide();
    $(".form-select").hide();

    $(".get-collections").on("click", function () {
      address = $("#wallet-address").val();
      if (address.length > 0) {
        getCards(address);
        $(".alert-danger").hide();
        $(".form-select").show();
      } else {
        $(".alert-danger").show();
      }
    });

    $(".form-select").on("change", function () {
      collectionName = $(".form-select option:selected").val();
      showImages(collectionName);
    });

    $(".get-download").on("click", function () {
      downloadImages(imagesArray);
    });

    function getCards(address) {
      // Make the AJAX call using the fetch function
      fetch(
        "https://api.elrond.com/accounts/" + address + "/collections?size=1000"
      )
        .then((response) => {
          // When the data is returned, parse it as JSON
          $(".get-download").show();
          $("option[value='1']").remove();
          return response.json();
        })
        .then((data) => {
          // Loop through the data and create a new card for each item

          var $dropdown = $(".form-select");

          data.forEach((item) => {
            console.log(item.collection);
            $dropdown.append(
              $("<option />").val(item.collection).text(item.collection)
            );
          });
        })
        .catch((error) => {
          // If there is an error, log it to the console
          console.error(error);
        });
    }

    function showImages(collectionName) {
      imagesArray = [];
      $(".container .row").html("");
      fetch(
        "https://api.elrond.com/accounts/" +
          address +
          "/nfts?collections=" +
          collectionName
      )
        .then((response) => {
          // When the data is returned, parse it as JSON
          return response.json();
        })
        .then((data) => {
          // Loop through the data and create a new card for each item
          data.forEach((item) => {
            // Create the card element
            const card = document.createElement("div");
            card.classList.add("col");
            if (item.type !== "MetaESDT") {
              var urlImage;
              urlImage = item.media[0].thumbnailUrl;

              card.innerHTML = `
                  <div class="card bg-primary text-white text-center">
                  <img src="${urlImage}" class="card-img-top" alt="${item.title}">
                  <div class="card-body">
                    <h6 class="card-title">${item.identifier}</h6>
                  </div>
                  </div>
                `;

              imagesArray.push(item.media);

              // Append the card to the page
              document.querySelector(".container .row").appendChild(card);
            }
          });
        })
        .catch((error) => {
          // If there is an error, log it to the console
          console.error(error);
        });
    }

    function downloadImages(imagesUrls) {
      console.log(imagesUrls);

      // Loop through the list of URLs
      imagesUrls.forEach((url) => {
        var tempIndex = 0;
        var urlRequest = url[0].url;
        downloadImage(urlRequest)
      });

    }

    async function downloadImage(imageSrc) {
      const image = await fetch(imageSrc)
      const imageBlog = await image.blob()
      const imageURL = URL.createObjectURL(imageBlog)
    
      const link = document.createElement('a')
      link.href = imageURL
      link.download = 'image file name here'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    
  });
})(jQuery);
