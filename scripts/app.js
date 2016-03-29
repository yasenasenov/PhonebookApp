(function() {

    $(function() {
        registerEventHandlers();
        var currentUser = userSession.getCurrentUser();
        if (currentUser) {
            showUserHomeView();
        } else {
            showHomeView();
        }
    });

    function registerEventHandlers() {
        $("#btnShowLoginView").click(showLoginView);
        $("#btnLoginRegister").click(showRegisterView);
        $("#btnShowRegisterView").click(showRegisterView);
        $("#btnLoginLogin").click(loginClicked);
        $("#btnRegister").click(registerClicked);
        $("#btnRegisterLogin").click(showLoginView);
        $("#phonebookBtn").click(showPhonebookView);
        $("#addPhoneBtn").click(showAddPhoneForm);
        $("#addPhoneBtnInside").click(showAddPhoneForm);
        $("#addNewPhoneBtn").click(addPhoneClicked);
        $("#cancel").click(showPhonebookView);
        $("#logoutBtn").click(logoutClicked);
        $("#delConfirmBtn").click(deleteContact);
        $("#editProfileBtn").click(showEditProfileForm);
//        $(#editBtn).click(editContact);


    }

    function showHomeView() {
        $("#wrapper > *").hide();
        $("#homeView").show();
    }

    function showLoginView() {
        $("#wrapper > *").hide();
        $("#loginView").show();
        $("#txtLoginUsername").val('');
        $("#txtLoginPassword").val('');
    }

    function loginClicked() {
        var username = $("#txtLoginUsername").val();
        var password = $("#txtLoginPassword").val();
        ajaxRequester.login(username, password, authSuccess, loginError);
    }

    function authSuccess(data) {
        userSession.login(data);
        showUserHomeView();
        showInfoMessage("Login successful");
    }

    function loginError(error) {
        showAjaxError("Login failed", error);
    }

    function logoutClicked() {
        userSession.logout();
        $("#menu").hide();
        $("#header span").text("");
        showHomeView();
    }

    function showRegisterView() {
        $("#wrapper > *").hide();
        $("#registerView").show();
        $("#txtRegisterUsername").val('');
        $("#txtRegisterPassword").val('');
    }

    function registerClicked() {
        var username = $("#txtRegisterUsername").val();
        var password = $("#txtRegisterPassword").val();
        var fullName = $("#fullName").val();
        ajaxRequester.register(username, password, fullName,
            function(data) {
                data.username = username;
                authSuccess(data);
            },
            registerError);
    }

    function registerError(error) {
        showAjaxError("Register failed", error);
    }

    function showUserHomeView() {
        var currentUser = userSession.getCurrentUser();
        if (currentUser) {
            $("#wrapper > *").hide();
            $("#userHomeView").show();
            $("#menu").show();
            $("#header span").text(" - Home");
            $("#userHomeDiv h1").text("Welcome, " + currentUser.username);
        } else {
            showHomeView();
        }
    }

    function showPhonebookView(){
        var currentUser = userSession.getCurrentUser();
        if (currentUser) {
            $("#phones > tbody").html("");
            $("#wrapper > *").hide();
            $("#phonebookView").show();
            $("#header span").text(" - List");

            var sessionToken = currentUser.sessionToken;

            ajaxRequester.getPhonebook(sessionToken, loadPhonebookSuccess, loadPhonebookError);
        } else {
            showHomeView();
        }
    }

    function loadPhonebookSuccess(data) {
        for (var p in data.results) {
            var contact = data.results[p];
            var $contactTr = $("<tr>");
            $contactTr.data("contact", contact);

            var $person = $("<td class='person'>");
            $person.text(contact.person);
            $contactTr.append($person);

            var $number = $("<td class='number'>");
            $number.text(contact.number);
            $contactTr.append($number);

            var btns = $('<td>');

            var $editButton = $('<a href="#">Edit </a>');
            $editButton.click(editPhoneBtnClicked);
            var $deleteButton = $('<a href="#">Delete</a>');
            $deleteButton.click(deletePhoneBtnClicked);
            btns.append($editButton);
            btns.append($deleteButton);
            $contactTr.append(btns);

            $("#phones > tbody").append($contactTr);
        }
    }

    function loadPhonebookError(error) {
        showErrorMessage("Phonebook load failed.");
    }

    function showAddPhoneForm(){
        $("#wrapper > *").hide();
        $("#header span").text(" - Add Phone");
        $("#add-phone-form").show();
    }

    function addPhoneClicked() {
        var name = $("#personName").val();
        var phone = $("#phoneNumber").val();
        var currentUser = userSession.getCurrentUser();
        showInfoMessage("Phone added successfully");
        ajaxRequester.addNewPhone(name, phone, currentUser.objectId,
            showPhonebookView, addPhoneError);
    }

    function addPhoneError(error) {
        showErrorMessage("Contact add failed.");
    }

    function showEditForm(){
        $("#wrapper > *").hide();
        $("#edit-phone-form").show();
    }

    function editPhoneBtnClicked() {
        var contact = $(this).parent().parent().data('contact');
        sessionStorage["toEdit"] = JSON.stringify(contact);
        showEditForm();
    }

    function editContact(){
//        var currentUser = userSession.getCurrentUser();
//        var sessionToken = currentUser.sessionToken;
//        var contact = JSON.parse(sessionStorage["toEdit"]);
//
//        ajaxRequester.editContact(sessionToken, contact.objectId, showPhonebookView, deletePhoneError);
//        showInfoMessage("Contact successfully deleted")
    }

    function deletePhoneBtnClicked() {
        var contact = $(this).parent().parent().data('contact');
        sessionStorage["toDelete"] = JSON.stringify(contact);
        showDeleteConfirmForm();
    }


    function deleteContact() {
        var currentUser = userSession.getCurrentUser();
        var sessionToken = currentUser.sessionToken;
        var contact = JSON.parse(sessionStorage["toDelete"]);

        ajaxRequester.deleteContact(sessionToken, contact.objectId, showPhonebookView, deletePhoneError);
        showInfoMessage("Contact successfully deleted")
    }

    function deletePhoneError(error) {
        showErrorMessage("Delete phone failed.");
    }

    function showDeleteConfirmForm(){
        $("#wrapper > *").hide();
        $("#delete-phone-form").show();
        var contact = JSON.parse(sessionStorage["toDelete"]);
        var person = contact.person;
        var number = contact.number;
        $("#delNameConfirm").val(person);
        $("#delNumberConfirm").val(number);
    }

    function showEditProfileForm(){
        $("#wrapper > *").hide();
        $("#edit-profile-form").show();
    }

    function showAjaxError(msg, error) {
        var errMsg = error.responseJSON;
        if (errMsg && errMsg.error) {
            showErrorMessage(msg + ": " + errMsg.error);
        } else {
            showErrorMessage(msg + ".");
        }
    }

    function showInfoMessage(msg) {
        noty({
            text: msg,
            type: 'info',
            layout: 'topCenter',
            timeout: 2000
        });
    }

    function showErrorMessage(msg) {
        noty({
                text: msg,
                type: 'error',
                layout: 'topCenter',
                timeout: 2000}
        );
    }

})();
