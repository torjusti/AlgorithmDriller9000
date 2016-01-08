(function ($) {

    $(document).ready(function() {

        /*
         * When playing a test, suppress the default browser behavior
         * for Return keypress (default behaviour submits the form)
         */
        $('input.question-reply').keypress(function (e) {
            var code = e.keyCode || e.which;
            if (code === 13) {
                e.preventDefault();
                return false;
            }
        });
    });

})(jQuery);