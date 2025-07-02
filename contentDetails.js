console.clear();

let id = new URLSearchParams(window.location.search).get("id");

function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) {
        let cookieValue = parts.pop().split(";").shift();
        try {
            // Attempt to parse as JSON if it looks like an array
            if (cookieValue.startsWith('[') && cookieValue.endsWith(']')) {
                return JSON.parse(cookieValue);
            }
        } catch (e) {
            console.error("Error parsing cookie as JSON:", e);
        }
        return cookieValue; // Return as string if not JSON or parsing failed
    }
    return null; // Return null if cookie not found
}

// Update badge on page load
if (getCookie('counter')) {
    document.getElementById("badge").innerHTML = getCookie('counter');
}

function dynamicContentDetails(ob)
{
    let mainContainer = document.createElement('div')
    mainContainer.id = 'containerD'
    document.getElementById('containerProduct').appendChild(mainContainer);

    let imageSectionDiv = document.createElement('div')
    imageSectionDiv.id = 'imageSection'

    let imgTag = document.createElement('img')
    imgTag.id = 'imgDetails'
    imgTag.src = ob.preview

    imageSectionDiv.appendChild(imgTag)

    let productDetailsDiv = document.createElement('div')
    productDetailsDiv.id = 'productDetails'

    let h1 = document.createElement('h1')
    let h1Text = document.createTextNode(ob.name)
    h1.appendChild(h1Text)

    let h4 = document.createElement('h4')
    let h4Text = document.createTextNode(ob.brand)
    h4.appendChild(h4Text)

    let detailsDiv = document.createElement('div')
    detailsDiv.id = 'details'

    let h3DetailsDiv = document.createElement('h3')
    let h3DetailsText = document.createTextNode('Rs ' + ob.price)
    h3DetailsDiv.appendChild(h3DetailsText)

    let h3 = document.createElement('h3')
    let h3Text = document.createTextNode('Description')
    h3.appendChild(h3Text)

    let para = document.createElement('p')
    let paraText = document.createTextNode(ob.description)
    para.appendChild(paraText)

    let productPreviewDiv = document.createElement('div')
    productPreviewDiv.id = 'productPreview'

    let h3ProductPreviewDiv = document.createElement('h3')
    let h3ProductPreviewText = document.createTextNode('Product Preview')
    h3ProductPreviewDiv.appendChild(h3ProductPreviewText)
    productPreviewDiv.appendChild(h3ProductPreviewDiv)

    for(let i=0; i<ob.photos.length; i++)
    {
        let imgTagProductPreviewDiv = document.createElement('img')
        imgTagProductPreviewDiv.id = 'previewImg'
        imgTagProductPreviewDiv.src = ob.photos[i]
        imgTagProductPreviewDiv.onclick = function(event)
        {
            imgTag.src = this.src
            document.getElementById("imgDetails").src = this.src
        }
        productPreviewDiv.appendChild(imgTagProductPreviewDiv)
    }

    let buttonDiv = document.createElement('div')
    buttonDiv.id = 'button'

    let buttonTag = document.createElement('button')
    buttonDiv.appendChild(buttonTag)

    let buttonText = document.createTextNode('Add to Cart')
    buttonTag.onclick  =   function() {
        let currentOrderIds = getCookie('orderId');
        let orderIdsArray = Array.isArray(currentOrderIds) ? currentOrderIds : [];
        orderIdsArray.push(id); // Add the new product ID

        let currentCounter = Number(getCookie('counter')) || 0;
        currentCounter += 1;

        // Set cookies with updated values
        document.cookie = "orderId=" + JSON.stringify(orderIdsArray) + "; path=/";
        document.cookie = "counter=" + currentCounter + "; path=/";

        document.getElementById("badge").innerHTML = currentCounter;
        console.log('Cookie set - orderId:', getCookie('orderId'));
        console.log('Cookie set - counter:', getCookie('counter'));
    }
    buttonTag.appendChild(buttonText);

    mainContainer.appendChild(imageSectionDiv)
    mainContainer.appendChild(productDetailsDiv)
    productDetailsDiv.appendChild(h1)
    productDetailsDiv.appendChild(h4)
    productDetailsDiv.appendChild(detailsDiv)
    detailsDiv.appendChild(h3DetailsDiv)
    detailsDiv.appendChild(h3)
    detailsDiv.appendChild(para)
    productDetailsDiv.appendChild(productPreviewDiv)
    productDetailsDiv.appendChild(buttonDiv)

    return mainContainer
}

let httpRequest = new XMLHttpRequest()
httpRequest.onreadystatechange = function()
{
    if(this.readyState === 4 && this.status == 200)
    {
        let contentDetails = JSON.parse(this.responseText)
        dynamicContentDetails(contentDetails)
    }
}
httpRequest.open('GET', 'https://5d76bf96515d1a0014085cf9.mockapi.io/product/'+id, true)
httpRequest.send()
