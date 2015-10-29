var ids = [
    "name",
    "gtid",
    "phone",
    "email",
    "genderselect",
    "memberselect",
    "sport-select-1",
    "sport-select-2",
    "sport-select-3",
    "sport-select-4",
    "sport-select-5",
    "ball-team",
    "soccer-team",
    "card-holder-name",
    "card-number",
    "cvv"
];
$("#credit-card-section").hide();
var member = false;
function handleMemberSelect() {

    var selection = document.getElementById("memberselect").selectedIndex;
    // selected that this person is a member
    if (selection == 0) {
        $("#gtid-group").show(400, function() {
            $("#credit-card-section").hide(400);
        });
    }
    // not a member
    else {
        $("#credit-card-section").show(400, function() {
            $("#gtid-group").hide(400);
        })
    }
}

function handleCheckBoxes() {
    // show/hide team number inputs

    // if bball is selected
    if ($("#sport-select-0")[0].checked) {
        // show the bball team input
        $("#bball-team").show(400);
    } else {
        $("#bball-team").hide(400);
    }

    // if soccer is checked
    if ($("#sport-select-1")[0].checked) {
        $("#soccer-team").show(400);
    } else {
        $("#soccer-team").hide(400);
    }
}

function handleTextMessages() {
    
}

function isMember(gtid) {
    // TODO: implement this. given a gtid, return true/false if person is an india club member
    return true;
}

function creditCardInfoIsGood(card_num, card_holder_name, exp_date, cvc) {
    // TODO: verify that the payment info entered is valid
    return true;
}

function getNumSelected() {
    var n = 0;
    var opts = [
        "sport-select-1",
        "sport-select-2",
        "sport-select-3",
        "sport-select-4",
        "sport-select-5"
    ];

    for (var i = 0; i < opts.length; i++) {
        if ($("#" + opts[i])[0].checked) {
            n++;
        }
    }
    return n;
}

function handleRegister() {
    // make sure reqired stuff is there
    //if is member
    if (document.getElementById("memberselect").selectedIndex == 0) {
        // if member verification fails
        if (!isMember($("#gtid")[0].value)) {
            bootbox.alert("No member found for GTiD: " + $("#gtid")[0].value);
            return false;
        } else {
            member = true;
        }
    }

    // check number of sports selected
    if (getNumSelected() > 3) {
        bootbox.alert("You many only select up to 3 sports");
        return false;
    }

    // if is not member
    if (document.getElementById("memberselect").selectedIndex == 1) {
        // look for credit card info
        if ($("#card-holder-name")[0].value == "" ||
            $("#card-number")[0].value == "" ||
            $("#cvv")[0].value == "" ||
            $("#card-exp")[0].value == "") {

                bootbox.alert("Missing credit card info.");
                return false;

        }

        // verify credit card info
        if (!creditCardInfoIsGood($("#card-number")[0].value, $("#card-holder-name")[0].value, $("#card-exp")[0].value, $("#cvc")[0].value)) {
            bootbox.alert("There's an error in the payment info.");
            return false;
        }
    }

    // we are done vaidating the form
    // time to make the payment and push data
    //makePayment($("#card-number")[0].value, $("#card-holder-name")[0].value, $("#card-exp")[0].value, $("#cvc")[0].value);
    var data = {};
    data['name'] = $("#name")[0].value.trim();
    data['gtid'] = $("#gtid")[0].value.trim();
    data['phone'] = $("#phone")[0].value.trim();
    data['email'] = $("#email")[0].value.trim();
    // 1-> male 2-> female
    data['gender'] = $("#genderselect")[0].value;
    // 1-> Yes  2-> No
    data['notifications'] = $('#wants-text')[0].value;
    // compile and gather the sports data
    if ($("#sport-select-0")[0].checked) {
        data['basketball'] = 1;
    } else {
        data['basketball'] = 0;
    }
    if ($("#sport-select-1")[0].checked) {
        data['soccer'] = 1;
    } else {
        data['soccer'] = 0;
    }
    if ($("#sport-select-2")[0].checked) {
        data['badminton'] = 1;
    } else {
        data['badminton'] = 0;
    }
    if ($("#sport-select-3")[0].checked) {
        data['table-tennis'] = 1;
    } else {
        data['table-tennis'] = 0;
    }
    if ($("#sport-select-4")[0].checked) {
        data['raquetball'] = 1;
    } else {
        data['raquetball'] = 0;
    }
    if ($("#sport-select-5")[0].checked) {
        data['squash'] = 1;
    } else {
        data['squash'] = 0;
    }

    if (member) {
        data['isMember'] = 1;
    } else {
        data['isMember'] = 0;
    }

    data['bball_team'] = $('#bballnum')[0].value;
    data['soccer_team'] = $('#soccerteamnum')[0].value;
    Stripe.setPublishableKey('pk_live_gG9lP6pyVLcDXBF9wvdpa437');

    // now time to charge the card
    Stripe.card.createToken({
        number: $('#card-number')[0].value.trim(),
        cvc: $('#cvv')[0].value.trim(),
        exp_month: $('#card-exp')[0].value.split("/")[0],
        exp_year: $('#card-exp')[0].value.split("/")[1]
    }, function(status, response) {
        if (response.error) {
            bootbox.alert("Hmm looks like there is something wrong with the payment info.");
        } else {
            var token = response.id;
            data['stripe_token'] = token;
            $.post("/sports", JSON.stringify(data), function(d) {
                if (d.success == true) {
                    bootbox.alert("Got it! You have a ticket!");
                } else {
                    bootbox.alert("Hmm something went wrong");
                    return false;
                }
            });
        }


    });

    return false;
}
