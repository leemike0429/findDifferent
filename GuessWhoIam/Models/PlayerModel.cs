using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static GuessWhoIam.Services.GameSignalRHubService;

namespace GuessWhoIam.Models
{
  public class PlayerModel
  {
    public string Name { get; set; }
    public int Id { get; set; }
    public int BugId { get; set; }
    public int Life { get; set; }
    public string Percentage { get; set; }
    public int Score { get; set; }
    public string ConnectId { get; set; }
    public string Msg { get; set; }
    public bool Status { get; set; }
    public string RoomId { get; set; }
    public int Index { get; set; }
  }

  public class GameConfig
  {
    public string RoomId { get; set; }
    public int ThemeId { get; set; } //題型編號
    public int TopicIndex { get; set; } //題目編號
    public int[] CardList { get; set; }
  }

  public class RoomConfig
  {
    public PlayerList PlayerList { get; set; }
    public string RoomId { get; set; }
  }

  public class RoomData
  {
    public int Count { get; set; }
    public string RoomId { get; set; }
  }

  public class PlayerList
  {
    private List<PlayerModel> _list;
    private List<int> _totalList = new List<int> { 1, 2, 3, 4 };

    public PlayerList()
    {
      _list = new List<PlayerModel>();
    }
    public void AddPlayer(PlayerModel user)
    {
      if (!_list.Any(x=>x.Id == user.Id))
      {
        _list.Add(user);
      }

    }

    public int[] GetLeftList()
    {
      var list = GetList();
      var currentList = list.Select(x => x.Id).ToList();
      var leftList = _totalList.Except(currentList).ToArray();

      return leftList;
    }
    public List<PlayerModel> GetList() => _list;
    public PlayerModel GetPlayer(string connectId) => _list.FirstOrDefault(x => x.ConnectId == connectId);

    public void RemovePlayer(string connectId)
    {
      var result = _list.FirstOrDefault(x => x.ConnectId == connectId);
      if (result != null) _list.Remove(result);
    }
  }

  public class GameConfigList
  {
    private List<GameConfig> _configs;
    public GameConfigList()
    {
      _configs = new List<GameConfig>();
    }

    public void AddList(GameConfig config)
    {
      _configs.Add(config);
    }

    public List<GameConfig> GetList() => _configs;


    public GameConfig GetGameConfig(string roomId)
    {
      if (_configs.Any(x => x.RoomId == roomId))
      {
        return _configs.FirstOrDefault(x => x.RoomId == roomId);
      }
      else
      {
        var randomIndex = new Random().Next(1, 4);

        var randomId = new Random().Next(1, 5);
        int[] cardarray = new int[4];
        Random Random = new();
        for (int i = 0; i <= 3; i++)
        {
          int temp = Random.Next(2, 5);
          cardarray[i] = temp;
        }

        var config = new GameConfig
        {
          ThemeId = randomId,
          TopicIndex = randomIndex,
          CardList = cardarray,
          RoomId = roomId
        };
        _configs.Add(config);

        return config;
      }
    }

  }

  public class RoomList
  {
    private static readonly object block = new();
    private static List<RoomConfig> _roomList;

    public RoomList()
    {
      _roomList = new List<RoomConfig>();
    }
    public void AddRoom(RoomConfig room)
    {
      lock (block)
      {
        _roomList.Add(room);
      }
    }

    public void RemoveRooom()
    {
      lock (block)
      {
        if (_roomList.Any(x => x.PlayerList.GetList().Count == 0))
        {
          var rooms = _roomList.Where(x => x.PlayerList.GetList().Count == 0);
          foreach (var room in rooms)
          {
            _roomList.Remove(room);
          }
        }
      }
    }

    public List<RoomData> GetRooms()
    { 
      var result = _roomList.Select(x => new RoomData
      {
        Count = x.PlayerList.GetList().Count,
        RoomId = x.RoomId
      }).ToList();
      return result;
    }
    

    public List<RoomConfig> GetAllRoom() => _roomList;

    public RoomConfig SearchRoom(string roomId)
    {
      var result = _roomList.FirstOrDefault(x => x.RoomId == roomId);

      return result;
    }
  }
}