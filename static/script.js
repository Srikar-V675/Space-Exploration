const btn = document.getElementById('menu-btn');
const overlay = document.getElementById('overlay');
const menu = document.getElementById('mobile-menu');
const counters = document.querySelectorAll('.counter');

if (window.location.pathname != '/') {
    btn.addEventListener('click', navToggle);
}

// toggling side menu
function navToggle() {
    btn.classList.toggle('open');
    overlay.classList.toggle('overlay-show');
    menu.classList.toggle('show-menu');
}

// counter
function countUp( ) {
    counters.forEach((counter) => {
        counter.innerText = '0';

        const updateCounter = () => {
            // Get count target
            const target = +counter.getAttribute('data-target');

            // Get current counter value
            const c = +counter.innerText;
            // create an increment
            const increment = target / 100;

            // If counter is less than target, add increment
            if(c < target) {
                counter.innerText = `${Math.ceil(c + increment)}`;
                setTimeout(updateCounter, 100);
            } else {
                counter.innerText = target;
            }
        };

        updateCounter();
    });
}
countUp( );


// Animation
document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll('.data-card');

    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('animation-delay');
        }, index * 500);
    });
});

var page_m = 1;

// Check if the current page is missions.html
if (window.location.pathname === '/missions') {
    // Get more missions

    function getMoreMissions() {
        // Get filter values
        $('#showMoreButton').show();
        $('#showMoreFilterButton').hide();

        // Make an Ajax request to get more missions
        $.ajax({
            type: 'POST',
            url: '/get_missions',
            data: { page: page_m },
            success: function(response) {
                var missions = response.missions;

                if (missions.length > 0) {
                    // Append new missions to the container
                    missions.forEach(function(mission) {
                        // var missionHtml = '<div class="data-card" id="card{{ loop.index0 }} mission_card_' + mission.mission_id + '">';
                        // missionHtml += '<div class="card-content" onclick="redirectToMissionDetails(' + mission.mission_id + ')">';
                        // missionHtml += '<img src="' + mission.IMG_URL + '" alt="' + mission.name + '" class="mission-image">';
                        // missionHtml += '<div class="text-content">';
                        // missionHtml += '<h2 class="mission-name">' + mission.name + '</h2>';
                        // missionHtml += '<p class="agency">' + mission.agency + '</p>';
                        // missionHtml += '<p class="launch-date">Launch Date: ' + mission.launch_date + '</p>';
                        // missionHtml += '<p class="target-celestial">Target Celestial: ' + mission.target_celestial_body + '</p>';
                        // missionHtml += '<p class="purpose">Purpose: ' + mission.purpose + '</p>';
                        // missionHtml += '<p class="status">Status: ' + mission.status + '</p>';
                        // missionHtml += '</div>';
                        // missionHtml += '</div>';
                        // missionHtml += '</div>';

                        var missionHtml = '<div class="data-card" id="card{{ loop.index0 }}">';
                        missionHtml += '<div class="card-content" onclick="redirectToMissionDetails(' + mission.mission_id + ')">';
                        missionHtml += '<img src="' + mission.IMG_URL + '" alt="' + mission.name + '" class="mission-image">';
                        missionHtml += '<div class="mission-info">';
                        missionHtml += '<div class="details-row">';
                        missionHtml += '<p class="agency">' + mission.agency + '</p>';
                        missionHtml += '<p class="launch-date">Launch Date: ' + mission.launch_date + '</p>';
                        missionHtml += '</div>';
                        missionHtml += '<div class="details-row">';
                        missionHtml += '<h2 class="mission-name">' + mission.name + '</h2>';
                        missionHtml += '</div>';
                        missionHtml += '<div class="details-row">';
                        missionHtml += '<p class="target-celestial">' + mission.target_celestial_body + '</p>';
                        missionHtml += '<p class="purpose">' + mission.purpose + '</p>';
                        missionHtml += '<p class="status">' + mission.status + '</p>';
                        missionHtml += '</div>';
                        missionHtml += '</div>';
                        missionHtml += '</div>';
                        missionHtml += '</div>';


                        $('#missionsContainer').append(missionHtml);
                    });

                    page_m++;  // Increment the page for the next request
                } else {
                    // No more missions to load
                    $('#showMoreButton').hide();
                }
            },
            error: function(error) {
                console.error('Error fetching missions: ', error);
            }
        });
    }

    // Get more missions
    getMoreMissions();
}



// Clear data cards
function clearDataCards(element) {
    // Assuming your data cards are in a container with id 'data-cards-container'
    const missionsContainer = document.getElementById(element);
    missionsContainer.innerHTML = ''; // Clear the content of the container
}

var page_f = 1;


// Update page_f value to 1 on form submit event and clear data cards
$('#filterForm').on('submit', function(event) {
    if (window.location.pathname === '/missions') {
        // Update page_f value to 1
        event.preventDefault();
        page_f = 1;
        clearDataCards("missionsFilteredContainer");
        getMoreFilteredMissions();
    }
    if (window.location.pathname === '/rovers') {
        // Update page_f value to 1
        event.preventDefault();
        page_f = 1;
        clearDataCards("roversFilteredContainer");
        getMoreFilteredRovers();
    }
    if (window.location.pathname === '/astronauts') {
        // Update page_f value to 1
        event.preventDefault();
        page_f = 1;
        clearDataCards("astrosFilteredContainer");
        getMoreFilteredAstronauts();
    }
});


// Get more filtered missions
function getMoreFilteredMissions() {
    // Get filter values
    $('#showMoreFilterButton').show();
    $('#showMoreButton').hide();
    var agency = $('#agencyFilter').val();
    var target = $('#targetFilter').val();
    var status = $('#statusFilter').val();
    var year = $('#yearFilter').val();
    // console.log(agency, target, status, page_f);
    // Make an Ajax request to get more missions
    $.ajax({
        type: 'POST',
        url: '/get_missions',
        data: { agency : agency, target : target, status : status, year : year, page: page_f },
        success: function(response) {
            var missions = response.missions;
            if (page_m > 1){
                clearDataCards('missionsContainer');
            }
            if (missions.length > 0) {
                // Append new missions to the container
                missions.forEach(function(mission) {
                    // var missionHtml = '<div class="data-card" id="card{{ loop.index0 }} mission_card_' + mission.mission_id + '">';
                    // missionHtml += '<div class="card-content" onclick="redirectToMissionDetails(' + mission.mission_id + ')">';
                    // missionHtml += '<img src="' + mission.IMG_URL + '" alt="' + mission.name + '" class="mission-image">';
                    // missionHtml += '<div class="text-content">';
                    // missionHtml += '<h2 class="mission-name">' + mission.name + '</h2>';
                    // missionHtml += '<p class="agency">' + mission.agency + '</p>';
                    // missionHtml += '<p class="launch-date">Launch Date: ' + mission.launch_date + '</p>';
                    // missionHtml += '<p class="target-celestial">Target Celestial: ' + mission.target_celestial_body + '</p>';
                    // missionHtml += '<p class="purpose">Purpose: ' + mission.purpose + '</p>';
                    // missionHtml += '<p class="status">Status: ' + mission.status + '</p>';
                    // missionHtml += '</div>';
                    // missionHtml += '</div>';
                    // missionHtml += '</div>';

                    var missionHtml = '<div class="data-card" id="card{{ loop.index0 }}">';
                        missionHtml += '<div class="card-content" onclick="redirectToMissionDetails(' + mission.mission_id + ')">';
                        missionHtml += '<img src="' + mission.IMG_URL + '" alt="' + mission.name + '" class="mission-image">';
                        missionHtml += '<div class="mission-info">';
                        missionHtml += '<div class="details-row">';
                        missionHtml += '<p class="agency">' + mission.agency + '</p>';
                        missionHtml += '<p class="launch-date">Launch Date: ' + mission.launch_date + '</p>';
                        missionHtml += '</div>';
                        missionHtml += '<div class="details-row">';
                        missionHtml += '<h2 class="mission-name">' + mission.name + '</h2>';
                        missionHtml += '</div>';
                        missionHtml += '<div class="details-row">';
                        missionHtml += '<p class="target-celestial">' + mission.target_celestial_body + '</p>';
                        missionHtml += '<p class="purpose">' + mission.purpose + '</p>';
                        missionHtml += '<p class="status">' + mission.status + '</p>';
                        missionHtml += '</div>';
                        missionHtml += '</div>';
                        missionHtml += '</div>';
                        missionHtml += '</div>';

                    $('#missionsFilteredContainer').append(missionHtml);
                });

                page_f++;  // Increment the page for the next request
            } else {
                // No more missions to load
                $('#showMoreFilterButton').hide();
            }
        },
        error: function(error) {
            console.error('Error fetching missions: ', error);
        }
    });
}

// event listener to form submit button to call getMoreFilteredMissions or getMoreMissions
$('#showMoreButton, #showMoreFilterButton').on('click', function() {
    if (window.location.pathname === '/missions') {
        if ($(this).is('#showMoreButton')) {
            getMoreMissions();  // Call getMoreMissions function
        } else if ($(this).is('#showMoreFilterButton')) {
            getMoreFilteredMissions();  // Call getMoreFilteredMissions function
        }
    }
    if (window.location.pathname === '/rovers') {
        if ($(this).is('#showMoreButton')) {
            getMoreRovers();  // Call getMoreRovers function
        } else if ($(this).is('#showMoreFilterButton')) {
            getMoreFilteredRovers();  // Call getMoreFilteredRovers function
        }
    }
    if (window.location.pathname === '/astronauts') {
        if ($(this).is('#showMoreButton')) {
            getMoreAstronauts();  // Call getMoreAstronauts function
        } else if ($(this).is('#showMoreFilterButton')) {
            getMoreFilteredAstronauts();  // Call getMoreFilteredAstronauts function
        }
    }
});

// Function to redirect to mission details
function redirectToMissionDetails(mission_id) {
    window.location.href = '/mission_details/' + mission_id;
}

var page_r = 1;

// get more rovers
// Check if the current page is /rovers
if (window.location.pathname === '/rovers') {   
    // Get more missions

    function getMoreRovers() {
        // Get filter values
        $('#showMoreButton').show();
        $('#showMoreFilterButton').hide();

        // Make an Ajax request to get more missions
        $.ajax({
            type: 'POST',
            url: '/get_rovers',
            data: { page: page_r },
            success: function(response) {
                var rovers = response.rovers;

                if (rovers.length > 0) {
                    // Append new missions to the container
                    rovers.forEach(function(rover) {
                        // var roverHtml = '<div class="data-card" id="card{{ loop.index0 }} rover_card_' + rover.ROVER_ID + '">';
                        // roverHtml += '<div class="card-content" onclick="redirectToRoverDetails(' + rover.ROVER_ID + ')">';
                        // roverHtml += '<img src="' + rover.IMG_URL + '" alt="' + rover.NAME + '" class="rover-image">';
                        // roverHtml += '<div class="text-content">';
                        // roverHtml += '<h2 class="rover-name">' + rover.NAME + '</h2>';
                        // roverHtml += '<p class="agency">' + rover.AGENCY + '</p>';
                        // roverHtml += '<p class="launch-date">Landing Date: ' + rover.LANDING_DATE + '</p>';
                        // roverHtml += '<p class="target-celestial">Destination: ' + rover.DESTINATION + '</p>';
                        // roverHtml += '<p class="status">Status: ' + rover.STATUS + '</p>';
                        // roverHtml += '<p class="type">Rover Type: ' + rover.ROVER_TYPE + '</p>';
                        // roverHtml += '</div>';
                        // roverHtml += '</div>';
                        // roverHtml += '</div>';

                        var roverHtml = '<div class="data-card" id="card{{ loop.index0 }}">'
                            + '<div class="card-content" onclick="redirectToRoverDetails(' + rover.ROVER_ID + ')">'
                            + '<img src="' + rover.IMG_URL + '" alt="' + rover.NAME + '" class="rover-image">'
                            + '<div class="mission-info">'
                            + '<div class="details-row">'
                            + '<p class="agency">' + rover.AGENCY + '</p>'
                            + '<p class="launch-date">Landing Date: ' + rover.LANDING_DATE + '</p>'
                            + '</div>'
                            + '<div class="details-row">'
                            + '<h2 class="rover-name">' + rover.NAME + '</h2>'
                            + '</div>'
                            + '<div class="details-row">'
                            + '<p class="target-celestial">' + rover.DESTINATION + '</p>'
                            + '<p class="status">' + rover.STATUS + '</p>'
                            + '<p class="type">' + rover.ROVER_TYPE + '</p>'
                            + '</div>'
                            + '</div>'
                            + '</div>'
                            + '</div>';


                        $('#roversContainer').append(roverHtml);
                    });

                    page_r++;  // Increment the page for the next request
                } else {
                    // No more missions to load
                    $('#showMoreButton').hide();
                }
            },
            error: function(error) {
                console.error('Error fetching missions: ', error);
            }
        });
    }

    getMoreRovers();
}


// get more filtered rovers
function getMoreFilteredRovers() {
    // Get filter values
    $('#showMoreFilterButton').show();
    $('#showMoreButton').hide();

    var agency = $('#agencyFilter').val();
    var destination = $('#destinationFilter').val();
    var status = $('#statusFilter').val();
    var year = $('#yearFilter').val();
    // Make an Ajax request to get more missions
    $.ajax({
        type: 'POST',
        url: '/get_rovers',
        data: { agency: agency, destination: destination, status: status, year: year, page: page_f },
        success: function(response) {
            var rovers = response.rovers;
            if (page_r >1){
                clearDataCards('roversContainer');
            }
            if (rovers.length > 0) {
                // Append new missions to the container
                rovers.forEach(function(rover) {
                    // var roverHtml = '<div class="data-card" id="card{{ loop.index0 }} rover_card_' + rover.ROVER_ID + '">';
                        // roverHtml += '<div class="card-content" onclick="redirectToRoverDetails(' + rover.ROVER_ID + ')">';
                        // roverHtml += '<img src="' + rover.IMG_URL + '" alt="' + rover.NAME + '" class="rover-image">';
                        // roverHtml += '<div class="text-content">';
                        // roverHtml += '<h2 class="rover-name">' + rover.NAME + '</h2>';
                        // roverHtml += '<p class="agency">' + rover.AGENCY + '</p>';
                        // roverHtml += '<p class="launch-date">Landing Date: ' + rover.LANDING_DATE + '</p>';
                        // roverHtml += '<p class="target-celestial">Destination: ' + rover.DESTINATION + '</p>';
                        // roverHtml += '<p class="status">Status: ' + rover.STATUS + '</p>';
                        // roverHtml += '<p class="type">Rover Type: ' + rover.ROVER_TYPE + '</p>';
                        // roverHtml += '</div>';
                        // roverHtml += '</div>';
                        // roverHtml += '</div>';

                    var roverHtml = '<div class="data-card" id="card{{ loop.index0 }}">'
                            + '<div class="card-content" onclick="redirectToRoverDetails(' + rover.ROVER_ID + ')">'
                            + '<img src="' + rover.IMG_URL + '" alt="' + rover.NAME + '" class="rover-image">'
                            + '<div class="mission-info">'
                            + '<div class="details-row">'
                            + '<p class="agency">' + rover.AGENCY + '</p>'
                            + '<p class="launch-date">Landing Date: ' + rover.LANDING_DATE + '</p>'
                            + '</div>'
                            + '<div class="details-row">'
                            + '<h2 class="rover-name">' + rover.NAME + '</h2>'
                            + '</div>'
                            + '<div class="details-row">'
                            + '<p class="target-celestial">' + rover.DESTINATION + '</p>'
                            + '<p class="status">' + rover.STATUS + '</p>'
                            + '<p class="type">' + rover.ROVER_TYPE + '</p>'
                            + '</div>'
                            + '</div>'
                            + '</div>'
                            + '</div>';

                    $('#roversFilteredContainer').append(roverHtml);
                });

                page_f++;  // Increment the page for the next request
            } else {
                // No more missions to load
                $('#showMoreFilterButton').hide();
            }
        },
        error: function(error) {
            console.error('Error fetching missions: ', error);
        }
    });
}

// function to redirect to rover details
function redirectToRoverDetails(rover_id) {
    window.location.href = '/rover_details/' + rover_id;
}


// function to get more astronauts 
if (window.location.pathname === '/astronauts') {
    getMoreAstronauts();
}

var page_a = 1;

function getMoreAstronauts() {
    $('#showMoreButton').show();
    $('#showMoreFilterButton').hide();

    // Make an AJAX request to get more astronauts
    $.ajax({
        type: 'POST',
        url: '/get_astronauts',
        data: { page: page_a },
        success: function(response) {
            var astronauts = response.astronauts;

            if (astronauts.length > 0) {
                // append new astronauts to the container
                astronauts.forEach( function(astronaut) {
                    var astronautHTML = '<div class="astro-card">';
                    astronautHTML += '<div class="astro-card-content" onclick="redirectToAstronautDetails(' + astronaut.astronaut_id + ')">';
                    astronautHTML += '<img src="' + astronaut.img_url + '" alt="' + astronaut.name + '" class="astro-image">';
                    astronautHTML += '<div class="astro-text-content">';
                    astronautHTML += '<h1 class="astro-name">' + astronaut.name + '</h1>';
                    astronautHTML += '<div class="astro-text">';
                    astronautHTML += '<p class="astro-nationality">Nationality: ' + astronaut.nationality + '</p>';
                    astronautHTML += '<p class="astro-born">Born Date: ' + astronaut.born_date + '</p>';
                    astronautHTML += '<p class="astro-timeInSpace">Time in Space: ' + astronaut.time_in_space + '</p>';
                    astronautHTML += '<p class="astro-missions">Missions Participated: ' + astronaut.missions_participated + '</p>';
                    astronautHTML += '</div>';
                    astronautHTML += '</div>';
                    astronautHTML += '</div>';
                    astronautHTML += '</div>';

                    $('#astrosContainer').append(astronautHTML);
                });

                page_a++;
                } else {
                    // No more astronauts to load
                    $('#showMoreButton').hide();
                }
            },
            error: function(error) {
                console.error('Error fetching astronauts: ', error);
            }
        });
    }


// get more filtered astronauts
function getMoreFilteredAstronauts() {
    // get filter values
    $('#showMoreFilterButton').show();
    $('#showMoreButton').hide();

    var nationality = $('#nationalityFilter').val();
    var year = $('#yearFilter').val();
    var mission = $('#missionsFilter').val();

    // Make an Ajax request to get more astronauts
    $.ajax({
        type: 'POST',
        url: '/get_astronauts',
        data: { page: page_f, nationality: nationality, year: year, mission: mission },
        success: function(response) {
            var astronauts = response.astronauts;
            if (page_a > 1){
                clearDataCards('astrosContainer');
            }

            if (astronauts.length > 0) {
                // append new astronauts to the container
                astronauts.forEach( function(astronaut) {
                    var astronautHTML = '<div class="astro-card">';
                    astronautHTML += '<div class="astro-card-content" onclick="redirectToAstronautDetails(' + astronaut.astronaut_id + ')">';
                    astronautHTML += '<img src="' + astronaut.img_url + '" alt="' + astronaut.name + '" class="astro-image">';
                    astronautHTML += '<div class="astro-text-content">';
                    astronautHTML += '<h1 class="astro-name">' + astronaut.name + '</h1>';
                    astronautHTML += '<p class="astro-nationality">Nationality: ' + astronaut.nationality + '</p>';
                    astronautHTML += '<p class="astro-born">Born Date: ' + astronaut.born_date + '</p>';
                    astronautHTML += '<p class="astro-timeInSpace">Time in Space: ' + astronaut.time_in_space + '</p>';
                    astronautHTML += '<p class="astro-missions">Missions Participated: ' + astronaut.missions_participated + '</p>';
                    astronautHTML += '</div>';
                    astronautHTML += '</div>';
                    astronautHTML += '</div>';

                    $('#astrosFilteredContainer').append(astronautHTML);
                });

                page_f++;
                } else {
                    // No more astronauts to load
                    $('#showMoreFilterButton').hide();
                }
            },
            error: function(error) {
                console.error('Error fetching astronauts: ', error);
            }
        });
}

function redirectToAstronautDetails(astronaut_id) {
    window.location.href = '/astronaut_details/' + astronaut_id;
}



// Redirect to mission details page when a card is clicked on the main page
if (window.location.pathname === '/home') {
    $('#showMoreButton').on('click', function() {
        window.location.href = '/missions';
    });
    $('p[id="id"]').hide();
    $('.data-card').on('click', function() {
        var mission_id = $(this).find('#id').text(); // Select the ID within the clicked card
        // console.log(mission_id);
        redirectToMissionDetails(mission_id);
    });
}

// Redirect to mission details page when a card is clicked on the mission bookmarks page
if (window.location.pathname === '/mission_bookmarks') {
    $('p[id="id"]').hide();
    $('.data-card').on('click', function() {
        var mission_id = $(this).find('#id').text(); // Select the ID within the clicked card
        // console.log(mission_id);
        redirectToMissionDetails(mission_id);
    });
}

// Redirect to rover details page when a card is clicked on the rover bookmarks page
if (window.location.pathname === '/rover_bookmarks') {
    $('p[id="id"]').hide();
    $('.data-card').on('click', function() {
        var rover_id = $(this).find('#id').text(); // Select the ID within the clicked card
        console.log(rover_id);
        redirectToRoverDetails(rover_id);
    });
}

// scroll to year milestones page
$('#scrollToYearButton').on('click', function() {
  var selectedYear = $('#yearDropdown').val();
  // console.log(selectedYear);
  if (selectedYear) {
    scrollToFirstMilestoneOfYear(selectedYear);
  }
});


function scrollToFirstMilestoneOfYear(year) {
    var milestones = $('.timeline-event');
    for (var i = 0; i < milestones.length; i++) {
        var milestoneYear = milestones[i].getAttribute('data-year');
        // console.log(milestoneYear);
        if (milestoneYear === year) {
            milestones[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
            $(milestones[i]).addClass('highlighted'); // Add a CSS class to highlight the milestone
            setTimeout(function() {
                $(milestones[i]).removeClass('highlighted'); // Remove the CSS class after a delay
            }, 1000); // Adjust the delay as needed
            break;
        }
    }
}






// LOG IN SIGN UP JS CODE 


// Hashing password using CryptoJS
function hashPassword(password) {
    // Create a SHA-256 hash object
    const hash = CryptoJS.SHA256(password);

    // Get the hashed password in hexadecimal format
    var hashedPassword = hash.toString();

    return hashedPassword;
}



// Sign up
function signup() {
    var username = $('input[name="txt"]').val();
    var email = $('input[name="email"]').val();
    var password = $('input[name="pswd"]').val();

    // Hash the password
    password = hashPassword(password);

    // Make an Ajax request to sign up
    $.ajax({
        type: 'POST',
        url: '/signup',
        data: { username: username, email: email, password: password },
        success: function(response) {
            if (response.success) {
                alert(response.message)
                window.location.href = '/home';
            } else {
                alert(response.message);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error signing up: ', textStatus, errorThrown);
            alert(jqXHR.responseJSON.message);
        }
    });
}


$('#signupForm').on('submit', function(event){
    event.preventDefault();
    signup();
})


// Login
function login() {
    var email = $('input[name="emailL"]').val();
    var password = $('input[name="pswdL"]').val();

    // Hash the password
    password = hashPassword(password);

    // Make an Ajax request to sign up
    $.ajax({
        type: 'POST',
        url: '/login',
        data: { email: email, password: password },
        success: function(response) {
            if (response.success) {
                alert(response.message)
                window.location.href = '/home';
            } else {
                alert(response.message);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error logging in: ', textStatus, errorThrown);
            alert(jqXHR.responseJSON.message);
        }
    });
}

$('#loginForm').on('submit', function(event){
    event.preventDefault();
    login();
})



// API calls for bookmarks missions

function bookmark(id, type) {
    $.ajax({
        type: 'GET',
        url: '/check_bookmark',
        data: { id: id, type: type },
        success: function(response) {
            if (response.is_bookmarked) {
                $('.bookmark-checkbox').prop('checked', true);
            }
            else {
                $('.bookmark-checkbox').prop('checked', false);
            }
        },
        error: function(error) {
            console.error('Error checking bookmark: ', error);
        }
    });


    // listen for changes in the bookmark-checkbox
    $('.bookmark-checkbox').on('change', function() {
        var isChecked = $(this).prop('checked');

        // Update bookmark status
        $.ajax({
            type: 'POST',
            url: '/bookmark',
            data: { id: id, isChecked: isChecked, type: type },
            success: function(response) {
                // console.log('Bookmark updated successfully');
            },
            error: function(error) {
                console.error('Error updating bookmark: ', error);
            }
        });
    });
}

// bookmark mission
const url = window.location.pathname;
const pattern = /^\/mission_details\/\d+$/;
if (pattern.test(url)) {
    $('p[id="id"]').hide();
    var id = parseInt($('p[id="id"]').text());
    var type = 'missions';
    $(document).ready( bookmark(id, type) );  
}

// bookmark rover
const pattern2 = /^\/rover_details\/\d+$/;
if (pattern2.test(url)) {
    $('p[id="id"]').hide();
    var id = parseInt($('p[id="id"]').text());
    var type = 'rovers';
    $(document).ready( bookmark(id, type) );  
}

// bookmark astronaut
const pattern3 = /^\/astronaut_details\/\d+$/;
if (pattern3.test(url)) {
    $('p[id="id"]').hide();
    var id = parseInt($('p[id="id"]').text());
    var type = 'astronauts';
    $(document).ready( bookmark(id, type) );  
}

// redirect to bookmark missions
function redirectToMissionBookmarks() {
    window.location.href = '/mission_bookmarks';
}

// enable click on mission bookmarks
if (window.location.pathname === '/mission_bookmarks') {
    $('p[id="id"]').hide();
    $('.card-content').on('click', function() {
        var mission_id = $('#id').text();
        // console.log(mission_id);
        redirectToMissionDetails(mission_id);
    });
}

// redirect to bookmark rovers
function redirectToRoverBookmarks() {
    window.location.href = '/rover_bookmarks';
}

// enable click on rover bookmarks
if (window.location.pathname === '/rover_bookmarks') {
    $('p[id="id"]').hide();
    $('.card-content').on('click', function() {
        var rover_id = $('#id').text();
        // console.log(rover_id);
        redirectToRoverDetails(rover_id);
    });
}

// redirect to bookmark astronauts
function redirectToAstronautBookmarks() {
    window.location.href = '/astronaut_bookmarks';
}

// enable click on astronaut bookmarks
if (window.location.pathname === '/astronaut_bookmarks') {
    $('p[id="id"]').hide();
    $('.astro-card-content').on('click', function() {
        var astronaut_id = $('#id').text();
        // console.log(astronaut_id);
        redirectToAstronautDetails(astronaut_id);
    });
}


// user logout
$('.user-logout').on('click', function() {
    window.location.href = '/logout';
})

// username update


$('.update-username').on('click', function() {
    $('#update-username-modal').show();
})

// close modal
$('.close').on('click', function() {
    $('#update-username-modal').hide();
})

$('#updateBtn').on('click', function(){
    var newUsername = $('#newUsername').val();

    $.ajax({
        type: 'POST',
        url: '/update_username',
        data: { newUsername: newUsername },
        success: function(response) {
            alert('Username updated successfully');
            $('#update-username-modal').hide();
            location.reload();
        },
        error: function(error) {
            console.error('Error updating username: ', error);
        }
    });
})