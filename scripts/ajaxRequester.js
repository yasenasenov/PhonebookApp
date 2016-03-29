'use strict';

var ajaxRequester = (function() {
    var baseUrl = "https://api.parse.com/1/";

    var headers =
    {
        "X-Parse-Application-Id": "dsm92uVJ3wndER8SQeNN1e0kQ9dXDNxAfbpkgscD",
        "X-Parse-REST-API-Key": "MDkpsHt1bAwThX8MpjG9vhvmxzhB6wiPA3cG2UHv"
    };

    function login(username, password, success, error) {
        jQuery.ajax({
            method: "GET",
            headers: headers,
            url: baseUrl + "login",
            data: {username: username, password: password},
            success: success,
            error: error
        });
    }

    function register(username, password, fullName, success, error) {
        jQuery.ajax({
            method: "POST",
            headers: headers,
            url: baseUrl + "users",
            data: JSON.stringify({username: username, password: password , fullName:fullName}),
            success: success,
            error: error
        });
    }

    function getHeadersWithSessionToken(sessionToken) {
        var headersWithToken = JSON.parse(JSON.stringify(headers));
        headersWithToken['X-Parse-Session-Token'] = sessionToken;
        return headersWithToken;
    }

    function getPhonebook(sessionToken, success, error) {
        var headersWithToken = getHeadersWithSessionToken(sessionToken);
        jQuery.ajax({
            method: "GET",
            headers: headersWithToken,
            url: baseUrl + "classes/Phone",
            success: success,
            error: error
        });
    }

    function addNewPhone(userName, phoneNumber, userId, success, error) {
        var phone = {person:userName, number:phoneNumber, ACL : {}};
        phone.ACL[userId] = {"write": true, "read": true};
        jQuery.ajax({
            method: "POST",
            headers: headers,
            url: baseUrl + "classes/Phone",
            data: JSON.stringify(phone),
            success: success,
            error: error
        });
    }

    function deleteContact(sessionToken, contactId, success, error) {
        var headersWithToken = getHeadersWithSessionToken(sessionToken);
        jQuery.ajax({
            method: "DELETE",
            headers: headersWithToken,
            url: baseUrl + "classes/Phone/" + contactId,
            success: success,
            error: error
        });
    }


    return {
        login: login,
        register: register,
        getPhonebook: getPhonebook,
        addNewPhone: addNewPhone,
        deleteContact : deleteContact
    };
})();
