using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GuessWhoIam.Models
{
    public class AttackCardsModel
    {
       
        public class Attack
        {
            public int Attacker { get; set; }
            public int Card { get; set; }
            public int Attacked { get; set; }
            public string RoomId { get; set; }
        }
        public enum CardCategoryID
        {
            阻擋卡=1,
            吸血卡=2,
            加時卡=3,
            搶奪卡=4
        }

        public class CardCategory
        {
            public string Name { get; set; }
            public string Effect { get; set; }
        }
        public List<CardCategory> AllCardList()
        {
            return new List<CardCategory>
            {
                new CardCategory{Name="阻擋卡",Effect="將指定玩家畫面遮蔽2.5秒"},
                new CardCategory{Name="吸血卡",Effect="將指定玩家血量變成1"},
                new CardCategory{Name="加時卡",Effect="增加自身秒數5秒"},
                new CardCategory{Name="搶奪卡",Effect="隨機搶奪一個玩家的道具"},
            };
        }

    }
}
