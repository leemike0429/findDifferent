const messages = {
    en: {
        index: {
            title: "Let's Find and Fight!",
            titles: ["Let's ", "Find", "and Fight!"],
            titlesstyle: "font-size-small",
            hall: "Game Lobby",
            rule: "Game Rule",
            choice: "Language",
            itemdescription: "Item Description",
            gameintroduction: "Game Introduction",
            cards: [{ name: "Blocking", effect: "Block the screen of the specified player for 2.5 secs" }, { name: "Snatch", effect: "Randomly snatch items from specified players" }, { name: "Vampire", effect: "Change the HP of the specified player to1" }, { name: "Seconds", effect: "Increase self seconds by 5 seconds" }],
            rules: ["Find 'Five differences' between two pictures within the limited time, and use the props to defeat your opponents in exciting battles!", "Each player has three lives, and one life will be deducted if the answer is wrong. The game is over when the life is zero!"],
            langs: [{ lang: "Chinese(Traditional)", value: "tw" }, { lang: "Chinese(Simplified)", value: "cn" }, { lang: "English", value: "en" }]
        },
        warning: "In order to fully experience this game, please use the 'desktop browser' to play.",
        Lobby: {
            back:"Back",
            hall: "Gaming Lobby",
            title: "Enter Room Name",
            confirm: "Confirm",
            create: "Create Room",
            roomname: "RoomID",
            en: "English",
            tw: "Chinese(Traditional)",
            cn: "Chinese(Simplified)",
            header: "Game Lobby - Let's Find and Fight!!"
        },
        waitingroom: {
            users: ["Mickey", "Minnie", "Goofy", "Donald Duck"],
            me: "Me",
            prepareWord: "Prepare",
            preparingWord: "Preparing",
            preparedWord: "Prepared",
            exit: "Exit",
            send: "Send",
            mickey: "Mickey",
            minnie: "Minnie",
            goofy: "Goofy",
            donaldduck: "Donald Duck",
            join: "Enter Room...",
            leave: "Leave Game Room...",
            header: "Game Room - Find The Wrong And Fight!!"
        },
        timer: {
            sec: "Sec"
        },
        userlist: {
            header: "Gaming - Let's Find and Fight!!",
            me: "me"
        },
        result: {
            header: "Game Result - Let's Find and Fight!!",
            result: "Battle Result",
            rank: "Rank",
            player: "Player",
            score: "Score"
        }
    },
    tw: {
        index: {
            title: "找碴大對抗!",
            titles: ["找", "碴", "大對抗!"],
            titlesstyle: "font-size-big",
            hall: "遊戲大廳",
            rule: "遊戲規則",
            choice: "選擇語言",
            itemdescription: "道具說明",
            gameintroduction: "玩法介紹",
            cards: [{ name: "阻擋卡", effect: "將指定玩家畫面遮蔽2.5秒" }, { name: "搶奪卡", effect: "隨機搶奪指定玩家的道具" }, { name: "吸血卡", effect: "將指定玩家血量變成1" }, { name: "秒數卡", effect: "增加自身秒數5秒" }],
            rules: ["時限內找出兩張圖片的五處不同，並利用道具在刺激的對戰中戰勝對手!", "每位玩家有三條生命，答錯一次則扣一條命，生命歸零遊戲就結束囉!"],
            langs: [{ lang: "繁體", value: "tw" }, { lang: "簡體", value: "cn" }, { lang: "英文", value: "en" }]
        },
        warning: "為了能完整體驗本遊戲，請以「桌機瀏覽器」進行遊玩。",
        Lobby: {
            back: "返回",
            hall: "遊戲大廳",
            title: "輸入房號",
            confirm: "確認",
            create: "創建房間",
            roomname: "房號",
            en: "英文",
            tw: "繁體",
            cn: "簡體",
            header: "遊戲大廳 - 找碴大對抗!"
        },
        waitingroom: {
            users: ["米奇", "米妮", "高飛", "唐老鴨"],
            me: "我",
            prepareWord: "準備",
            preparingWord: "準備中",
            preparedWord: "準備完成",
            exit: "離開",
            send: "發送",
            mickey: "米奇",
            minnie: "米妮",
            goofy: "高飛",
            donaldduck: "唐老鴨",
            join: "加入遊戲間...",
            leave: "離開遊戲間...",
            header: "遊戲房 - 找碴大對抗!"
        },
        timer: {
            sec: "秒"
        },
        userlist: {
            header: "遊戲中 - 找碴大對抗!",
            me: "我"
        },
        result: {
            header: "遊戲結果 - 找碴大對抗",
            result: "對戰結果",
            rank: "排名",
            player: "玩家",
            score: "分數"
        }
    },
    cn: {
        index: {
            title: "老铁，來決鬥吧!",
            titles: ["老铁，", "來", "決鬥吧!"],
            titlesstyle: "font-size-big",
            hall: "游戏大厅",
            rule: "游戏规则",
            choice: "选择语言",
            itemdescription: "道具说明",
            gameintroduction: "玩法介绍",
            cards: [{ name: "阻挡卡", effect: "将指定玩家画面遮蔽2.5秒" }, { name: "抢夺卡", effect: "随机抢夺指定玩家的道具" }, { name: "吸血卡", effect: "将指定玩家血量变成1" }, { name: "秒数卡", effect: "增加自身秒数5秒" }],
            rules: ["时限内找出两张图片的五处不同，并利用道具在刺激的对战中战胜对手!", "每位玩家有三条生命，答错一次则扣一条命，生命归零游戏就结束啰!"],
            langs: [{ lang: "繁体", value: "tw" }, { lang: "简体", value: "cn" }, { lang: "英文", value: "en" }]
        },
        warning: "为了能完整体验本游戏，请以「桌机浏览器」进行游玩。",
        Lobby: {
            back: "返回",
            hall: "游戏大厅",
            title: "输入房号",
            confirm: "确认",
            create: "创建房间",
            roomname: "房号",
            en: "英文",
            tw: "繁体",
            cn: "简体",
            header: "游戏大厅 - 老铁，来决斗吧"
        },
        waitingroom: {
            users: ["米奇", "米妮", "高飞", "唐老鸭"],
            me: "我",
            prepareWord: "准备",
            preparingWord: "准备中",
            preparedWord: "准备完成",
            exit: "离开",
            send: "发送",
            mickey: "米奇",
            minnie: "米妮",
            goofy: "高飞",
            donaldduck: "唐老鸭",
            join: "加入游戏间...",
            leave: "离开游戏间...",
            header: "游戏间 - 老铁，来决斗吧"
        },
        timer: {
            sec: "秒"
        },
        userlist: {
            header: "游戏中 - 老铁，来决斗吧",
            me: "我"
        },
        result: {
            header: "游戏结果 - 老铁，来决斗吧",
            result: "对战结果",
            rank: "排名",
            player: "玩家",
            score: "分数"
        }
    }
};

export default messages