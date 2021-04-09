function openDoor(field) {
    var y = $(field).find(".thumb");
    var x = y.attr("class");


    if (y.hasClass("thumbOpened")) {
        y.removeClass("thumbOpened");
    } else {
        $(".thumb").removeClass("thumbOpened");
        y.addClass("thumbOpened");
    }
}




var gamingLobby = new Vue({
    el: "#app",
    data() {

        return {
            name: '',
            nameState: null,
            submittedNames: [],
            warningWord: "不要重複",
        }


    },
    created: function () {
        this.hasFour();
    },
    methods: {
        hasFour() {
            if (this.submittedNames.length > 4) {
                $("#door").addClass("door_scroll");
            }
        },

        checkFormValidity() {
            const valid = this.$refs.form.checkValidity()
            this.nameState = valid
            return valid
        },
        resetModal() {
            this.name = ''
            this.nameState = null
        },
        handleOk(bvModalEvt) {
            // Prevent modal from closing
            bvModalEvt.preventDefault()
            // Trigger submit handler
            this.handleSubmit()
        },
        handleSubmit() {
            // Exit when the form isn't valid
            if (this.submittedNames.includes(this.name)) {
                this.warningWord = "你重複囉"
                return
            }
            if (!this.checkFormValidity()) {

                return
            }

            // Push the name to submitted names
            this.submittedNames.push(this.name)
            // Hide the modal manually
            this.$nextTick(() => {
                this.$bvModal.hide('modal-prevent-closing')
            })
        },
    }

})