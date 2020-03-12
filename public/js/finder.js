(function () {
    var card = document.querySelectorAll('.match-card');

    // mouseover Event
    for (var i = 0; i < card.length; i++) {
        let elem = card[i];
        elem.addEventListener('mouseover', function (ev) {
            elem.style.transition = '0.2s';
            elem.style.border = '3px solid #EB6864';
        })
    }
    // mouseleave Event
    for (var i = 0; i < card.length; i++) {
        let elem = card[i];
        elem.addEventListener('mouseleave', function (ev) {
            elem.style.transition = '0.2s';
            elem.style.border = '1px solid';
        })
    }
    // click Event
    for (var i = 0; i < card.length; i++) {
        let elem = card[i];
        elem.addEventListener('click', function (ev) {
            let username = elem.querySelector('h3').innerHTML;
            console.log('THE username IS ' + username);
            socket.emit('notif', username);
        })
    }

    // Partie Sort et Filter
    var formSort = document.querySelector('#form-sort');
    var formFilter = document.querySelector('#form-filter');
    var selectSortBy = document.querySelector('#sort');
    var filterAge = document.querySelector('#filterAge');
    var filterPopularity = document.querySelector('#filterPopularity');
    var filterTags = document.querySelector('#filterTags');
    var filterDistance = document.querySelector('#filterDistance');

    selectSortBy.addEventListener('change', function (ev) {
        formSort.submit();
    })
    if (filterAge) {
        filterAge.addEventListener('change', function (ev) {
            formFilter.submit();
        })
    }
    if (filterPopularity) {
        filterPopularity.addEventListener('change', function (ev) {
            formFilter.submit();
        })
    }
    if (filterTags) {
        filterTags.addEventListener('change', function (ev) {
            formFilter.submit();
        })
    }
        if (filterDistance) {
        filterDistance.addEventListener('change', function(ev) {
            formFilter.submit();
        })
    }

    var socket = io();
    socket.on('online check', function (username) {
        let user = document.querySelector('#currentUser').innerHTML;
        if (username === user) {
            socket.emit('online resp', username);
        }
    })

    socket.on('notif resp', function (dest) {
        let user = document.querySelector('#currentUser').innerHTML;
        if (dest === user) {
            setTimeout(function () {
                location.reload();
            }, 500)
        }
    })


})()