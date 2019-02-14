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

    // FOR EACH SOURCE
    for (let source in localData)
    {
        // Make sure the source name is a valid HTML ID;
        let id = source.replace(/[^A-Za-z0-9]+/g, "")
        
        let sourceHolder =  document.createElement("div");
        sourceHolder.style = "background-color:rgba(0,0,0,0.5); color:rgb(200,200,200); margin: 1rem; padding:1rem; font-size: 1.5rem; font-weight : bold; border-bottom:1px solid rgb(250, 180, 60); "

        let sourceDelete = document.createElement("button");
        sourceDelete.innerHTML = "Delete";
        sourceDelete.className = `${source}`; 
        sourceDelete.style = "background-color:rgb(50,50,50); font-size : 1.1rem; border-radius:0.2rem; padding-bottom:0.5rem; padding-top:0.4rem; width: 5rem; cursor:pointer; border:none; height : 100%;";
        sourceDelete.addEventListener('click', (event) => {LocalData.deleteSource(event.target.className);writeContentList();})
        sourceHolder.append(sourceDelete);

        let sourceActive = document.createElement("input");
        sourceActive.type = "checkbox";
        sourceActive.checked = localData[source].isActive;
        sourceActive.className = `${source}`;
        sourceActive.style = "background-color : rgb(200,200,200);  width:1rem; font-size : 1rem; margin-left : 5rem;";
        sourceActive.addEventListener('change', (event) => { LocalData.toggleSourceActive(event.target.className, event.target.checked)})
        sourceHolder.append(sourceActive);

        let sourceName = document.createElement("p");
        sourceName.innerHTML = source;
        sourceName.style = "cursor: pointer; height: 100%; display : inline; margin-left: 5rem;"
        sourceName.addEventListener('click', (event) => 
        {
            let target = document.querySelector(`#${id}Holder`);
            if(target.style.display == "none")
            {
                target.style.display = "";
            }
            else
            {
                target.style.display = "none";
            }
        })
        sourceHolder.append(sourceName);

        holder.append(sourceHolder);

        // FOR EACH KEY IN THE SOURCE (TROOPS, ITEMS, ...)
        let sourceContent = document.createElement("div");
        sourceContent.id = `${id}Holder`;
        sourceContent.style = "background-color:rgba(0,0,0,0.5); margin: 1rem; margin-top:-1rem; padding:1rem; color:rgb(200,200,200); border-bottom : 1px solid rgb(250, 180, 60);";
        sourceContent.style.display = "none";
        for(let key in localData[source])
        {
            if(key !== "isActive" && localData[source][key].length > 0)
            {
                let keyName = document.createElement("div");
                keyName.innerHTML = `${key.toUpperCase()} (${localData[source][key].length})`;
                keyName.style = "cursor: pointer; padding : 0.6rem; padding-left: 2rem;"
                keyName.addEventListener('click', (event) =>
                {
                    let target = document.querySelector(`#${source.replace(/\s+/, "")}${key}`);
                    if(target.style.display == "none")
                    {
                        target.style.display = "";
                    }
                    else
                    {
                        target.style.display = "none";
                    }
                });
                sourceContent.append(keyName);

                // FOR EACH ELEMENT
                let keyContent = document.createElement("div");
                keyContent.id = `${source.replace(/\s+/, "")}${key}`;
                keyContent.style.display = "none"
                let cpt = 0;
                localData[source][key].forEach(element =>
                {
                    let desc = ``;
                    if(key == "actions")
                    {
                        desc = new Action(element).describe();
                    }
                    if(key == "conditions")
                    {
                        desc = new Condition(element).describe();
                    }
                    let elementName = document.createElement("div");
                    let time = `Created : ${getTimeSince(element).value} ${getTimeSince(element).unit} ago.`;
                    elementName.innerHTML = 
                        `<input type="submit" value="Delete" style="margin-right:2.5rem;" onclick='deleteFromStorage("${source}", "${key}", ${cpt}); writeContentList();' /> 
                        ${element.name}${time} <br/> ${desc} `;
                    elementName.style = "cursor: default; padding : 0.25rem; padding-left: 7rem; border-bottom:1px solid rgb(250,180,60); border-bottom-left-radius : 10rem;";

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