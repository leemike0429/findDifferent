var app = new Vue({
    el:'#room',
    data: function () {
        return {
            users: [
                {
                    name:'米奇',
                    photo:'../images/mickey.gif'
                }, {
                    name:'米妮',
                    photo:'../images/minnie.gif'
                }, {
                    name:'唐老鴨',
                    photo:'../images/donaldDuck.gif'
                }, {
                    name:'高飛',
                    photo:'../images/goofy.gif'
                },
            ],
            
        }
    },
    methods: {

    },
    created() {
    }

})