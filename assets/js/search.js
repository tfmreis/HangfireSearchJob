jQuery.expr[':'].contains = function(a, i, m) {
    return jQuery(a).text().toUpperCase()
        .indexOf(m[3].toUpperCase()) >= 0;
  };

var jobSearcher = new function () {
    
    var select = '<select id="sizePage">'+
        '<option value="100">100</option>'+
        '<option value="500">500</option>'+
        '<option value="1000">1000</option>'+
        '<option value="5000">5000</option>'+
        '<option value="10000">10000</option>'+
    '</select>';

    var createSearchBox = function () {        
        $('#search-box').closest('div').remove();
        $('.js-jobs-list').prepend('<div class="search-box-div">' +
                                       '<input type="text" id="search-box" placeholder="Search by Job Name..."></input>' +
                                       '<label class="page-size">Items per page: </label>'+select+
                                       '<button id="searchFilter" class="btn-search btn btn-sm btn-primary">Search</button>'+ 
                                       '<button onclick="window.location.reload()" class="btn-search btn btn-sm btn-default">Clear search</button>'+ 
                                       '<p id="total-items"></p>'+
                                   '</div>'+
                                   '<div id="loading" class="center"></div>');
    }
    this.Init = function () {
        createSearchBox();
    }
    this.BindEvents = function(){

        $('#searchFilter').bind("click",function(e){
            var text = $('#search-box').val();

            if(text.length == 0)
                window.location.reload();
            else
                FilterJobs(text);  
        });
    }
  
    function setVisible(selector, visible) {
        document.querySelector(selector).style.display = visible ? 'block' : 'none';
    }

    function FilterJobs(keyword){        
        setVisible('#loading', true);
        
        var size = $("select option:selected").val();

        $(".table-responsive table").load(window.location.href.split('?')[0] + "?from=0&count="+ size +" .table-responsive table",
        function() {            
            var table = $('.table-responsive').find('table');            
            var filtered = [],filteredCount;
            if($(".navbar-nav li.active a").attr("href").indexOf("recurring")!==-1) {
                filtered = $(table).find('td:contains('+keyword+')').closest('tr');
            }
            else 
            {
                if($("div[class=list-group] .active").attr("href").indexOf("failed")!==-1)
                {
                    $(table).find('a[class=job-method]:contains('+ keyword +')').each(function() {
                        filtered.push($(this).closest('tr'));
                        filtered.push($(this).closest('tr').next('tr'));
                    });
                    filteredCount=filtered.length/2;
                }
                else
                {
                    filtered = $(table).find('a[class=job-method]:contains('+ keyword +')').closest('tr');
                }
            }

            $(table).find('tbody tr').remove();
            $(table).find('tbody').append(filtered);
            setVisible('#loading', false);
            $('.btn-group, .btn-toolbar-spacer, .btn-toolbar-label').css('visibility', 'hidden');
            $('#total-items').text("Total Items: " + (filteredCount?filteredCount:filtered.length));
        });  
    }

    
}
jobSearcher.Init();
jobSearcher.BindEvents();