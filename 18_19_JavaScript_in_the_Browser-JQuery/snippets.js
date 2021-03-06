/* Chap 18 Javascript in the browser */

//All the code snippets to be run in browser console for best results

/* function that traverses the entire DOM and prints it to the console */
function printDOM(node, prefix){
    console.log(prefix + node.nodeName);
    for(let i=0; i<node.childNodes.length; i++){
        printDOM(node.childNodes[i], prefix + '\t');
    }
}
printDOM(document, '');

/* DOM "Get" Methods */
document.getElementById('content'); // <div id="content">...</div>

// document.getElementByClassName returns a collection of elements that have the given class name
const callouts = document.getElementsByClassName('callout');

// document.getElementByTagName returns a collection of elements that have the given tag name
const paragraphs = document.getElementsByTagName('p');

/* Querying DOM Elements */
document.querySelectorAll('.callout');

document.querySelector('#content div p'); //<p>​This is as fancy as we'll get.​</p>​


document.querySelector('#content p'); // <p>​"This is a "<i>​simple​</i>​" HTML file."</p>​

document.querySelector('#content > p'); // <p>​"This is a "<i>​simple​</i>​" HTML file."</p>​

/* Manipulating DOM Elements */
// innerContent
const para1 = document.getElementsByTagName('p')[0];para1.textContent; // "This is a simple HTML file."
para1.innerHTML; // "This is a <i>simple</i> HTML file."
para1.textContent = "Modified HTML file"; // "Modified HTML file"
para1.innerHTML = "<i>Modified</i> HTML file"; // "<i>Modified</i> HTML file"

/* Create New DOM elements */
const p1 = document.createElement('p');
const p2 = document.createElement('p');
p1.textContent = "I was created dynamically!";
p2.textContent = "Me too";

// to add these newly created elements
const parent = document.getElementById('content');
const firstChild = parent.childNodes[0];

parent.insertBefore(p1, firstChild);
parent.appendChild(p2);

/* Styling Elements */
//CSS
//.highlight { background : #ff0; font-style: italic: }

// add highlight
function highlightParas(containing) {
    if(typeof containing === 'string')
        containing = new RegExp(`\\b${containing}\\b`, 'i');
    const paras = document.getElementsByTagName('p');
    console.log(paras);
    for(let p of paras){
        if(!containing.test(p.textContent)) continue;
        p.classList.add('highlight');
    }
}
highlightParas('unique');

// removing highlight
function removeParaHighlights(){
    const paras = document.querySelectorAll('p.highlight');
    for(let p of paras){
        p.classList.remove('highlight');
    }
}

/* Data Attributes */
const highlightAction = document.querySelectorAll('[data-action="highlight"]');

/* Events */
//set highlight
const highlightActions = document.querySelectorAll('[data-action="highlight"]');
for(let a of highlightActions){
    a.addEventListener('click', evt=>{
        evt.preventDefault();
        highlightParas(a.dataset.containing);
    });
}

//remove highlight
const removeHighlightActions = document.querySelectorAll('[data-action="removeHighlights"]');
for(let a of removeHighlightActions){
    a.addEventListener('click', evt=>{
        evt.preventDefault();
        removeParaHighlights();
    });
}
