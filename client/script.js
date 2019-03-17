var $ = require("jquery");
var todoTemplate = require("../views/partials/todo.hbs");

$(function() {
    $(":button").on("click", addTodo);
    $(":text").on("keypress", function(e) {
        var key = e.keyCode;
        if (key == 13 || key == 169) {
            addTodo();
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });
    $("ul").on("change", "li :checkbox", function() {
        var $this = $(this),
            $input = $this[0],
            $li = $this.parent(),
            id = $li.attr("id"),
            checked = $input.checked,
            data = { done: checked };
        //console.log(`$this: ${$this} | $input: ${$input} | $li: ${$li} | id: ${id} | checked: ${checked} | data: ${data}`);
        updateTodo(id, data, function(d) {
            $this.parent().toggleClass("checked");
            //console.log($this.parent());
        });
    });
    $("ul").on("keydown", "li span", function(e) {
        var $this = $(this),
            $span = $this[0],
            $li = $this.parent(),
            id = $li.attr("id"),
            key = e.keyCode,
            target = e.target;
        (text = $span.innerHTML), (data = { text: text });
        $this.addClass("editing");
        if (key === 27) {
            $this.removeClass("editing");
            document.execCommand("undo");
            target.blur();
        } else if (key === 13) {
            updateTodo(id, data, function(d) {
                $this.removeClass("editing");
                target.blur();
            });
            e.preventDefault();
        }
    });
    $("ul").on("click", "li a", function() {
        var $this = $(this),
            $input = $this[0],
            $li = $this.parent(),
            id = $li.attr("id");
        deleteTodo(id, function(e) {
            deleteTodoLi($li);
        });
    });
});

var addTodo = function() {
    var text = $("#add-todo-text").val();
    $.ajax({
        url: "/api/todos",
        type: "POST",
        data: {
            text: text
        },
        dataType: "json",
        success: function(data) {
            var todo = data.todo;
            //console.log(todo);
            var newLiHtml = todoTemplate(todo);
            //console.log(newLiHtml);
            $("form + ul").append(newLiHtml);
            $("#add-todo-text").val("");
        }
    });
};

var updateTodo = function(id, data, cb) {
    $.ajax({
        url: "/api/todos/" + id,
        type: "PUT",
        data: data,
        dataType: "json",
        success: function(data) {
            cb();
        }
    });
};

var deleteTodo = function(id, cb) {
    $.ajax({
        url: "/api/todos/" + id,
        type: "DELETE",
        data: {
            id: id
        },
        dataType: "json",
        success: function(data) {
            cb();
        }
    });
};

var deleteTodoLi = function($li) {
    $li.remove();
};
