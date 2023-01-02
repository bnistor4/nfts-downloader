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
            console.log(item.media);

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

              imagesArray.push(item.media[0].url);
              console.log(imagesArray);

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

        // Retrieve the image data
        fetch(url,{
  method: 'GET',
  mode: 'no-cors',
  headers: {
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Headers' : 'Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization',
  }
})
          .then((response) => {
            // Retrieve the image data as an ArrayBuffer
            return response.arrayBuffer();
          })
          .then((buffer) => {
            tempIndex = tempIndex+1;
            // Create a Blob object from the ArrayBuffer
            const blob = new Blob([buffer]);

            // Create a URL that can be used to download the image
            const objectURL = URL.createObjectURL(blob);

            // Extract the file name from the URL
            const fileName = collectionName+"_"+tempIndex;
            var urlSplit = url.split('.');

            // Create an anchor element
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = objectURL;
            a.download = tempIndex+urlSplit[1];

            // Append the anchor element to the body
            document.body.appendChild(a);

            // Click the anchor element to start the download
            a.click();

            // Remove the anchor element from the body
            document.body.removeChild(a);

            // Revoke the object URL
            URL.revokeObjectURL(objectURL);
          })
          .catch((error) => {
            // If there is an error, log it to the console
            console.error(error);
          });
      });
    }
  });
})(jQuery);
