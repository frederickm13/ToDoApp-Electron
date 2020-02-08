//////////////////////////
// View Model definition
//////////////////////////
function toDoItem(title, createdDate, lastModified, content) {
    var self = this;

    self.itemTitle = ko.observable(title);
    self.itemCreatedOn = createdDate;
    self.itemLastModifiedOn = lastModified;
    self.itemContent = content;
}

function toDoList(id, title, createdOn, modifiedOn) {
    var self = this;

    self.listId = id;
    self.listTitle = title;
    self.listCreatedOn = createdOn;
    self.listModifiedOn = modifiedOn;
    self.listItems = ko.observableArray();
}

function viewModel() {
    var self = this;

    self.home = ko.observable(true);
    self.itemLists = ko.observableArray();
    self.activeList = ko.observable();
    self.activeItem = ko.observable();
};

var appViewModel = new viewModel();


/////////////////////////
// Functions Definition
/////////////////////////
function RequestHomeData() {
    let fileName = "lists";
    JsonService.ReadJsonFileAsync(fileName)
        .then(function(data) {
            data.forEach(function(element) {
                let list = new toDoList(element.listId, element.listTitle, element.listCreatedOn, element.listModifiedOn);
                appViewModel.itemLists.push(list);
            });
        });
}

function RequestListData(list) {
    appViewModel.activeList(list);
    JsonService.ReadJsonFileAsync(list.listId.toString())
        .then(function(data) {
            data.forEach(function(element) {
                let item = new toDoItem(element.itemTitle, element.itemCreatedOn, element.itemLastModifiedOn, element.itemContent);
                appViewModel.activeList().listItems.push(item);
            });
        });

    appViewModel.home(false);
}

function ShowListItem(listItem) {
    appViewModel.activeItem(listItem);
}

function NavigateHome() {
    appViewModel.activeItem(null);
    appViewModel.activeList(null);
    appViewModel.itemLists([]);
    RequestHomeData();
    appViewModel.home(true);
}

function SaveAll() {
    let saveIcon = document.getElementById("SaveIcon");
    saveIcon.classList.add("w3-spin");

    // Add logic here to save
    let activeList = ko.toJSON(appViewModel.activeList().listItems);
    JsonService.WriteJsonFileAsync(appViewModel.activeList().listId.toString(), activeList)
        .then(function(successResponse) {
            console.log("Save executed successfully");
            saveIcon.classList.remove("w3-spin");
        }, function(errorResponse) {
            console.log("Save failed");
            saveIcon.classList.remove("w3-spin");
        });
}

function CreateNewList() {

}

function CreateNewListItem() {
    let newItem = new toDoItem("", new Date(), new Date(), "");
    appViewModel.activeList().listItems.push(newItem);
    appViewModel.activeItem(newItem);
}


/////////////////////
// Initialize Page
/////////////////////
ko.applyBindings(appViewModel);

window.addEventListener("DOMContentLoaded", function(event) {
    RequestHomeData();
})