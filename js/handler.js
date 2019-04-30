
var curPageOffset = 0;
var curPageIsEnd = false;
var curTitleIsSet = false;

function addStartPageContent(r) {
	var content = '<div class="col-md-4 post-item"><div class="post-item"><article class="post"><div class="post-preview">';
	if(r.is_drdr == 1) {
		content = content
		+ '<a href="./drdr-post-page?id=' + r.post_id +'"><img src="' + r.start_page_image_url_1 + '" border=0></a></div>'
		+ '<div class="post-wrapper"><div class="post-header"><h2 class="post-title">'
		+ '<a id="./drdr-post-page?id=' + r.post_id + '">'+ r.post_title +'</a></h2></div><div class="post-content">'
		+ '<p>' + r.post_content + '</p>'
		+ '<p><a href="./drdr-post-page?id=' + r.post_id + '">더보기</a></p></div></div></article></div></div>';
	}
	else {
		content = content
		+ '<a href="./farm-post-page?id=' + r.post_id +'"><img src="' + r.start_page_image_url_1 + '" border=0></a></div>'
		+ '<div class="post-wrapper"><div class="post-header"><h2 class="post-title">'
		+ '<a id="./farm-post-page?id=' + r.post_id + '">'+ r.post_title +'</a></h2></div><div class="post-content">'
		+ '<p>' + r.post_content + '</p>'
		+ '<p><a href="./farm-post-page?id=' + r.post_id + '">더보기</a></p></div></div></article></div></div>';
	}

	$('#post_contents').append(content);
}

function addFarmMainPageContent(pr) {
	var content = '<article class="post">'
		+ '<div class="post-preview"><a href="./farm-post-page?id=' + pr.page_id + '">'
		+ '<img src="' + pr.video_image_1 + '" alt=""></a></div>'
		+ '<div class="post-wrapper"><div class="post-header"><h2 class="post-title">'
		+ '<a href="./farm-post-page?id=' + pr.page_id + '">' + pr.post_title + '</a></h2><ul class="post-meta"><li>'
		+ makeDateStr(pr.post_date) + '</li></ul></div><div class="post-content"><p>'
		+ pr.post_content + '</p></div><div class="post-more"><a href="/farm-post-page?id=' + pr.page_id + '">더보기</a></div></div>'
		+ '</article>';

	$('#farm_contents').append(content);
}


function addDRDRPageContent(pr) {
	var content = '<article class="post">'
		+ '<div class="post-preview"><a href="./drdr-post-page?id=' + pr.page_id + '">'
		+ '<img src="' + pr.start_page_image_url_1 + '" alt=""></a></div>'
		+ '<div class="post-wrapper"><div class="post-header"><h2 class="post-title">'
		+ '<a href="./drdr-post-page?id=' + pr.page_id + '">' + pr.post_title + '</a></h2><ul class="post-meta"><li>'
		+ makeDateStr(pr.post_date) + '</li></ul></div><div class="post-content"><p>'
		+ pr.post_content + '</p></div><div class="post-more"><a href="./drdr-post-page?id=' + pr.page_id + '">더보기</a></div></div>'
		+ '</article>';

	$('#drdr_contents').append(content);
}

function addFarmListPageContent(pr) {
	var content = '<div class="col-md-4" ><div class="review-card">'
		+ '<div class="review-card-content">'
		+ '<p><a href=./farm-main-page?id=' + pr.page_id + '><span>' + pr.farm_intro + '</span></a></p></div>'
		+ '<div class="review-card-author"><p><a href=./farm-main-page?id=' + pr.page_id + '>'+ pr.farm_name + '</a></p>'
		+ '<div><a href=./farm-main-page?id=' + pr.page_id + '><img src="' + pr.title_bgimage_url + '" border=0></a></div></div></div></div>';

		$('#farm_contents').append(content);
}

function setFarmListPageToday(pr) {
	$("#farm_name").html(pr.farm_name);
	$('#today_title_bgimage_url').attr("data-background", pr.title_bgimage_url);
	$('#farm_page_url').attr("href", "./farm-main-page?id=" + pr.page_id);
}


function setFarmMainPage(farm_id) {
	if (curPageIsEnd == true) return;

	var url = "https://drdr.io/handler/handler.php?action=farm_page&id=" + farm_id + "&cur=" + curPageOffset;

  ajaxRequest(url, function (r) {
    if(r.result == "success") {
				r.data.forEach(function (pr) {
					if (pr.page_id == "end") {
						curPageIsEnd = true;
						return;
					}

					addFarmMainPageContent(pr)
				});

				curPageOffset += r.data.length;

				if (curPageIsEnd == true) {
					$("#loadermore").hide();
				}

				hideLoader();
    }
  }, function() {
			hideLoader();
  });
}

function setDRDRPage() {
	if (curPageIsEnd == true) return;

	var url = "https://drdr.io/handler/handler.php?action=drdr_page&cur=" + curPageOffset;
	var bFirst = true;

  ajaxRequest(url, function (r) {
    if(r.result == "success") {
				var rndv = Math.floor(Math.random() * (r.data.length - 1));
				var i = 0;
				r.data.forEach(function (pr) {
					if (pr.page_id == "end") {
						curPageIsEnd = true;
						return;
					}

					if (i == rndv) {
						$("#drdr-title").html(pr.post_title);
						$("#main-page-title").text("두런두런 DRDR - 당신의 논, 밭을 브랜딩해드립니다 : " + pr.post_title);
						$('#title_bgimage_url').css('background-image', 'url(' + r.start_page_image_url_1 + ')');
					}

					addDRDRPageContent(pr);
					i++;
				});

				curPageOffset += r.data.length;

				if (curPageIsEnd == true) {
					$("#loadermore").hide();
				}

				hideLoader();
    }
  }, function() {
			hideLoader();
  });
}


function setDRDRPostPage(page_id) {
	var url = "https://drdr.io/handler/handler.php?action=drdr_post&page_id=" + page_id;

	ajaxRequest(url, function (r) {
		if(r.result == "success") {
				$("#post_title").html(r.post_title);

				$("#post_date").html(makeDateStr(r.post_date));
				$("#post_content").html(r.post_content);
				$('#title_bgimage_url').css('background-image', 'url(' + r.start_title_bgimage_url + ')');
				if (r.video_url_1 == null || r.video_url_1 == "") {
					$('#video_url_1').hide();
				}
				else {
					$('#video_url_1').attr("href", r.video_url_1);
				}

				$('#video_image_1').attr("src", r.video_image_1);
				$('#post-post_footer').html(r.post_tags);

				if (r.hasOwnProperty("p_1")) {
					$('#drdr-prev-link').show();
					$('#drdr-next-link').show();
					if (r.p_0 < r.page_id) {
						$('#drdr-prev-link').attr("href", "./drdr-post-page?id=" + r.p_0);
						$('#drdr-next-link').attr("href", "./drdr-post-page?id=" + r.p_1);
					}
					else {
						$('#drdr-prev-link').attr("href", "./drdr-post-page?id=" + r.p_1);
						$('#drdr-next-link').attr("href", "./drdr-post-page?id=" + r.p_0);
					}

				}
				else if(r.hasOwnProperty("p_0")) {
					if (r.p_0 < r.page_id) {
						$('#drdr-prev-link').show();
						$('#drdr-prev-link').attr("href", "./drdr-post-page?id=" + r.p_0 );
					}
					else {
						$('#drdr-next-link').show();
						$('#drdr-next-link').attr("href", "./drdr-post-page?id=" + r.p_0 );
					}
				}
				else {
					$('#drdr-prev-link').hide();
					$('#drdr-next-link').hide();
				}
		}
	}, function() {

	});
}

function setFarmListPage() {
	var url = "https://drdr.io/handler/handler.php?action=farm_list&cur=" + curPageOffset;

  ajaxRequest(url, function (r) {
    if(r.result == "success") {
				var rndv = Math.floor(Math.random() * (r.data.length - 1));
				var i = 0;
				r.data.forEach(function (pr) {
					if (pr.page_id == "end") {
						curPageIsEnd = true;
						return;
					}

					addFarmListPageContent(pr);
					if (curTitleIsSet == false && i == rndv) {
						setFarmListPageToday(pr);
						curTitleIsSet = true;
					}
					i++;
				});

				curPageOffset += r.data.length;

				if (curPageIsEnd == true) {
					$("#loadermore").hide();
				}

				hideLoader();
    }
  }, function() {
			hideLoader();
  });
}


function setFarmMainPageInfo(farm_id) {
	var url = "https://drdr.io/handler/handler.php?action=farm_info&id=" + farm_id;

  ajaxRequest(url, function (r) {
    if(r.result == "success") {
				$("#farm-title").html(r.farm_name);
				$("#farm_owner_name").html(r.farm_owner_name);
				$("#main-page-title").text("두런두런 DRDR - 당신의 논, 밭을 브랜딩해드립니다 : " + r.farm_name);
				$("#farm_crops").html(r.farm_crops);
				$("#farm_size").html(r.farm_size);
				$('#title_bgimage_url').attr("data-background", r.title_bgimage_url);
				$('#farm_location_url').attr("src", r.farm_location_url);
    }
  }, function() {

  });
}

function setFarmPostPage(page_id) {
	var url = "https://drdr.io/handler/handler.php?action=farm_post&page_id=" + page_id;

	ajaxRequest(url, function (r) {
		if(r.result == "success") {
				$("#post_title").html(r.post_title);

				$("#post_date").html(makeDateStr(r.post_date));
				$("#post_content").html(r.post_content);
				$('#title_bgimage_url').css('background-image', 'url(' + r.title_bgimage_url + ')');
				if (r.video_url_1 == null || r.video_url_1 == "") {
					$('#video_url_1').hide();
				}
				else {
					$('#video_url_1').attr("href", r.video_url_1);
				}

				$('#video_image_1').attr("src", r.video_image_1);
				$('#farm-main-link').attr("href", "./farm-main-page?id=" + r.farm_id);
				$('#post-farm_url').attr("href", "./farm-main-page?id=" + r.farm_id);
				$('#post-post_footer').html(r.post_tags);
				$('#post-farm_name').html(r.farm_name);

				if (r.hasOwnProperty("p_1")) {
					$('#farm-prev-link').show();
					$('#farm-next-link').show();
					if (r.p_0 < r.page_id) {
						$('#farm-prev-link').attr("href", "./farm-post-page?id=" + r.p_0);
						$('#farm-next-link').attr("href", "./farm-post-page?id=" + r.p_1);
					}
					else {
						$('#farm-prev-link').attr("href", "./farm-post-page?id=" + r.p_1);
						$('#farm-next-link').attr("href", "./farm-post-page?id=" + r.p_0);
					}

				}
				else if(r.hasOwnProperty("p_0")) {
					if (r.p_0 < r.page_id) {
						$('#farm-prev-link').show();
						$('#farm-prev-link').attr("href", "./farm-post-page?id=" + r.p_0 );
					}
					else {
						$('#farm-next-link').show();
						$('#farm-next-link').attr("href", "./farm-post-page?id=" + r.p_0 );
					}
				}
				else {
					$('#farm-prev-link').hide();
					$('#farm-next-link').hide();
				}
		}
	}, function() {

	});
}

function setStartPage() {
	var url = "https://drdr.io/handler/handler.php?action=farm_start&cur=" + curPageOffset;

	ajaxRequest(url, function (r) {
		if(r.result == "success") {
				if (curTitleIsSet == false) {
					$('#title_bgimage_url').attr("data-background", r.start_title_bgimage_url);
					$('#title_bgimage_url').attr("data-jarallax-video", r.start_video_url);
					curTitleIsSet = true;
				}

				r.data.forEach(function (pr) {
					if (pr.post_id == "end") {
						curPageIsEnd = true;
						return;
					}

					addStartPageContent(pr);
				});

				curPageOffset += r.data.length;

				if (curPageIsEnd == true) {
					$("#loadermore").hide();
				}

				hideLoader();
		}
	}, function() {

	});
}


function loadNextStartPageData() {
	showLoader();
	setStartPage();
	hideLoader();
}

function loadNextFarmMainPageData() {
	var url_string = window.location.href;
	var page_id = location.search.split('id=')[1];

	showLoader();
	setFarmMainPage(page_id);
	hideLoader();
}


function loadNextFarmListData() {
	showLoader();
	setFarmListPage();
	hideLoader();
}

function loadNextDRDRPageData() {
	showLoader();
	setDRDRPage();
	hideLoader();
}

function setScrollEvent(callback) {
	// $(window).scroll(function(){
	//  		var docElement = $(document)[0].documentElement;
	//  		var winElement = $(window)[0];
	//
	//  		if ((docElement.scrollHeight - winElement.innerHeight) == winElement.pageYOffset)
	//  		{
	//  			callback();
	//  		}
	// });

	$(document).scroll(function (e) {
        var scrollAmount = $(window).scrollTop();
        var documentHeight = $('body').height();
        var viewPortHeight = $(window).height();

        var a = viewPortHeight + scrollAmount;
        var b = documentHeight - a;

        if(b < 100) {
            callback();
        }
	});
}

function setCountText(target_id, price, ttime) {
			$(target_id)
			.prop('number', 1)
			.animateNumber(
				{
					number: price
				},
				ttime
			);
}

function makeDateStr(dateStr) {
	var dtStr = dateStr.substr(0,8);
	var y = dtStr.substr(0,4);
	var m = dtStr.substr(4,2);
	var d = dtStr.substr(6,2);
	return y + "년 " + m + "월 " + d + "일";
}

function showLoader() {
	$("#loaderbox").show();
}

function hideLoader() {
	$("#loaderbox").hide();
}

function checkApplicationData() {

	if ($('#form_name').val() == "") {
		$('#contact-response').html("성함을 입력해 주세요.");
		return false;
	}

	if ($('#form_email').val() == "") {
		$('#contact-response').html("이메일을 입력해 주세요.");
		return false;
	}

	if ($('#form_phone').val() == "") {
		$('#contact-response').html("전화번호를 입력해 주세요.");
		return false;
	}

	if ($('#form_address').val() == "") {
		$('#contact-response').html("주소를 입력해 주세요.");
		return false;
	}

	if ($('#form_crop').val() == "") {
		$('#contact-response').html("키우시는 작물을 입력해 주세요.");
		return false;
	}

	return true;
}

var appSent = false;
function sendApplicationData(token)
{
	$('#form_token').val(token);
	var sed = $("form").serialize();
	$.ajax({
		type: "POST",
		dataType : "json",
		url: 'https://drdr.io/handler/contact.php',
		data:$("form").serialize(),
		success: function (data) {
			// Inserting html into the result div on success
			$('#contact-response').text(data.message);

			if (data.message.indexOf("감사합니다") >= 0) {
				appSent = true;
				$('#req_desc').hide();
				$('#req_form').hide();
			}
		},
		error: function(jqXHR, text, error){
			// Displaying if there are any errors
			$('#contact-response').text(error);
		}
	});
}

function setApplicatonPage() {

	$("form").on("submit", function(e) {
    e.preventDefault();

		if (checkApplicationData() == false || appSent == true) return;

		grecaptcha.ready(function() {
	      grecaptcha.execute('6LdQIX8UAAAAAFL6nTrxm-6GDFTxq9uA1FQNevLz', {action: 'homepage'}).then(function(token) {
	         sendApplicationData(token);
	      });
	  });
	});

}

/////////router///////////////////////////////////
function getData() {
	var url_string = window.location.href;
	var page_id = location.search.split('id=')[1];
	if (page_id != null)
		page_id = page_id.split('&')[0];
	var page_data = document.getElementById("page_data");
	var page_action = page_data.getAttribute("page_action");

	if (page_action == "start-page") {
		setStartPage();

		setCountText("#day_count", 365, 8000);
		setCountText("#hour_count", 24, 8000);

		setInterval(function(){
			$("#day_count").text("0");
			$("#hour_count").text("0");
			setCountText("#day_count", 365, 8000);
			setCountText("#hour_count", 24, 8000);
		}, 11000);
		setScrollEvent(loadNextStartPageData);
	}
	else if (page_action == "farm-post-page") {
		setFarmPostPage(page_id);
	}
	else if (page_action == "farm-main-page") {
		setFarmMainPage(page_id);
		setFarmMainPageInfo(page_id);
		setScrollEvent(loadNextFarmMainPageData);
	}
	else if (page_action == "farm-list-page") {
		setFarmListPage();
		setScrollEvent(loadNextFarmListData);
	}
	else if (page_action == "application") {
		setApplicatonPage();
	}
	else if (page_action == "drdr_page") {
		setDRDRPage();
		setScrollEvent(loadNextDRDRPageData);
	}
	else if (page_action == "drdr-post-page") {
		setDRDRPostPage(page_id);
	}
}

getData();
