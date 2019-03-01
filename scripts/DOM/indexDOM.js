function setup()
{
    writeContentList()
}
/** We grab the local Storage and loop through the contents.
*   - Ugly, right ? I guess just writing html tags inside `` would work better. 
*   - I mean, what's the style even doing here ?
*   - That's it ? Just the one huge-ass function ? Jee bro.
*/
function writeContentList()
{
    let localData = LocalData.getLocalStorage();
    let holder = document.querySelector(".sources");
    holder.innerHTML = "";

    // FOR EACH SOURCE (localStorage.content[SOURCE])
    for (let source in localData)
    {
        // Make sure the source name is a valid HTML ID;
        let id = source.replace(/[^A-Za-z0-9]+/g, "")
        
        let sourceHolder =  document.createElement("div");
        sourceHolder.className = "sourceHolder";

        let sourceDelete = document.createElement("button");
        sourceDelete.innerHTML = "Delete";
        sourceDelete.id = `${source}`; 
        sourceDelete.className = "deleteSourceButton"
        sourceDelete.addEventListener('click', (event) => {LocalData.deleteSource(event.target.id); writeContentList();})
        sourceHolder.append(sourceDelete);

        let sourceActive = document.createElement("input");
        sourceActive.type = "checkbox";
        sourceActive.checked = localData[source].isActive;
        sourceActive.id = `${source}`;
        sourceActive.className = "activityCheckbox"
        sourceActive.addEventListener('change', (event) => { LocalData.toggleSourceActive(event.target.id, event.target.checked)})
        sourceHolder.append(sourceActive);

        let sourceName = document.createElement("p");
        sourceName.innerHTML = source;
        sourceName.className = "sourceName";
        sourceName.addEventListener('click', (event) => 
        {
            let target = document.querySelector(`#${id}Holder`);
            if(target.style.display == "grid"){ target.style.display = "none"; }
            else{ target.style.display = "grid"; }
        })
        sourceHolder.append(sourceName);

        holder.append(sourceHolder);

        // FOR EACH KEY IN THE SOURCE (localStorage.content[SOURCE][KEY])
        let sourceContent = document.createElement("div");
        sourceContent.id = `${id}Holder`;
        sourceContent.className = "contentHolder";
        for(let key in localData[source])
        {
            if(key !== "isActive" && localData[source][key].length > 0)
            {
                let keyName = document.createElement("div");
                keyName.innerHTML = `${key.toUpperCase()} (${localData[source][key].length})`;
                keyName.className = "key";
                keyName.addEventListener('click', (event) =>
                {
                    let target = document.querySelector(`#${id}${key}`);
                    if(target.style.display == "none"){ target.style.display = "grid"; }
                    else{ target.style.display = "none"; }
                });
                sourceContent.append(keyName);

                // FOR EACH ELEMENT 
                let keyContent = document.createElement("div");
                keyContent.id = `${id}${key}`;
                keyContent.style.display = "none"
                let cpt = 0;
                localData[source][key].forEach(element =>
                {
                    let elementHTML = ``;
                    elementHTML += `<input type="submit" value="Delete" class="elementDeleteButton" onclick='deleteFromStorage("${source}", "${key}", ${cpt}); writeContentList();'/>`
                    elementHTML += `<p> ${element.name} `
                    if(element.timestamp)
                    {
                        let t = getTimeSince(element.timestamp)
                        elementHTML += ` - Created ${t.value} ${t.realUnit} ago `
                    }
                    if(key == "actions")
                    {
                        elementHTML += "- <br/>" + new Action(element).describe() + "</p>";
                    }
                    else if(key == "conditions")
                    {
                        elementHTML += "- <br/>" + new Condition(element).describe() + "</p>";
                    }
                    else
                    {
                        elementHTML += "</p>";
                    }
                    let elementName = document.createElement("div");
                    elementName.className = "element";
                    elementName.innerHTML = elementHTML;

                    keyContent.append(elementName);
                    cpt++;
                });
                sourceContent.append(keyContent);
                sourceContent.append(document.createElement("br"))
            }
        }
        holder.append(sourceContent);
    }
    document.querySelector("#contentList").append(holder);
}

// Why don't I call this directly, you ask ? 
function deleteFromStorage(source, key, id)
{
    LocalData.delete(source,key,id);
}