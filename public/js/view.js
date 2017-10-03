$(document).ready(function() {

  var $newItemInput = $("input.new-item");
  var $burgerContainer = $(".burger-container");
  var $devouredBurgerContainer = $(".devoured-burger-container");
  $(document).on("click", "button.delete", deleteBurger);
  $(document).on("click", "button.devour", toggleDevoured);
  $(document).on("click", ".burger-item", editBurger);
  $(document).on("keyup", ".burger-item", finishEdit);
  $(document).on("blur", ".burger-item", cancelEdit);
  $(document).on("submit", "#burger-form", insertBurger);

  var burgers = [];

  getBurgers();

  function initializeRows() {
    $burgerContainer.empty();
    $devouredBurgerContainer.empty();
    var rowsToAdd = [];
    var devouredRows = [];
    for (var i = 0; i < burgers.length; i++) {
      if (createNewRow(burgers[i]).hasClass("devoured-item")) {
        devouredRows.push(createNewRow(burgers[i]));
      } else {
        rowsToAdd.push(createNewRow(burgers[i]));
      }
    }
    $burgerContainer.prepend(rowsToAdd);
    $devouredBurgerContainer.prepend(devouredRows);
  }

  function getBurgers() {
    $.get("/api/burgers", function(data) {
      burgers = data;
      initializeRows();
    });
  }

  function deleteBurger(event) {
    event.stopPropagation();
    var id = $(this).data("id");
    $.ajax({
      method: "DELETE",
      url: "/api/burgers/" + id
    }).done(getBurgers);
  }

  function editBurger() {
    var currentBurger = $(this).data("burger");
    $(this).children().hide();
    $(this).children("input.edit").val(currentBurger.burger_name);
    $(this).children("input.edit").show();
    $(this).children("input.edit").focus();
  }

  function toggleDevoured(event) {
    event.stopPropagation();
    var burger = $(this).parent().data("burger");
    burger.devoured = !burger.devoured;
    updateBurger(burger);
  }

  function finishEdit() {
    var updatedBurger = $(this).data("burger");
    if (event.keyCode === 13) {
      updatedBurger.burger_name = $(this).children("input").val().trim();
      $(this).blur();
      updateBurger(updatedBurger);
    }
  }

  function updateBurger(burger) {
    $.ajax({
      method: "PUT",
      url: "/api/burgers",
      data: burger
    }).done(getBurgers);
  }

  function cancelEdit() {
    var currentBurger = $(this).data("burger");
    if (currentBurger) {
      $(this).children().hide();
      $(this).children("input.edit").val(currentBurger.burger_name);
      $(this).children("span").show();
      $(this).children("button").show();
    }
  }

  function createNewRow(burger) {
    var $newInputRow = $(
      [
        "<li class='container-fluid list-group-item burger-item'>",
        "<div class='container-fluid col-sm-6'>",
        "<span>",
        burger.burger_name,
        "</span>",
        "<input type='text' class='edit' style='display: none;'>",
        "</div>",
        "<div class='container-fluid col-sm-6'>",
        "<button class='devour btn btn-default col-sm-8'>Devour It!</button>",
        "<button class='delete btn btn-default col-sm-4'>X</button>",
        "</div>",
        "</li>"
      ].join("")
    );

    $newInputRow.find("button.delete").data("id", burger.id);
    $newInputRow.find("input.edit").css("display", "none");
    $newInputRow.data("burger", burger);
    if (burger.devoured) {
      $newInputRow.addClass("devoured-item");
      $newInputRow.find("button.devour").css("display", "none");
    } else {
      $newInputRow.removeClass("devoured-item");
    }
    return $newInputRow;
  }

  function insertBurger(event) {
    event.preventDefault();
    var burger = {
      burger_name: $newItemInput.val().trim(),
      devoured: false
    };

    $.post("/api/burgers", burger, getBurgers);
    $newItemInput.val("");
  }
});
