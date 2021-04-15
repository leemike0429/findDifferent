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
    public PlayerList Room { get; set; }
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

    public PlayerList()
    {
      _list = new List<PlayerModel>();
    }
    public void AddList(PlayerModel user)
    {
      _list.Add(user);
    }
    public List<PlayerModel> GetList()
    {
      return _list;
    }
    public PlayerModel GetPlayer(string connectId)
    {
      return _list.FirstOrDefault(x => x.ConnectId == connectId);
    }

    public void RemoveList(string connectId)
    {
      var result = _list.FirstOrDefault(x => x.ConnectId == connectId);
      if(result != null)
      {
        _list.Remove(result);
      }

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

    public List<GameConfig> GetList()
    {
      return _configs;
    }

    public GameConfig GetGameConfig(string roomId)
    {

      if (_configs.Any(x=>x.RoomId == roomId))
      {
        return _configs.FirstOrDefault(x=>x.RoomId == roomId);
      }
      else
      {
        var randomIndex = new Random().Next(1, 4);

        var randomId = new Random().Next(1, 5);
        int[] cardarray = new int[4];
        Random Random = new Random();
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
    private static readonly object block = new object();
    private static List<RoomConfig> _roomList;

    public string RoomId { get; set; }

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
      if (_roomList.Any(x => x.Room.GetList().Count == 0))
      {
        lock (block)
        {
          var rooms = _roomList.Where(x => x.Room.GetList().Count == 0);
          foreach (var room in rooms)
          {
            _roomList.Remove(room);
          }
        }
      }
    }

    public List<RoomData> GetRooms()
    {
      return _roomList.Select(x => new RoomData
      {
        Count = x.Room.GetList().Count,
        RoomId = x.RoomId
      }).ToList();
    }

    public List<RoomConfig> GetAllRoom()
    {
      return _roomList;
    }
    public RoomConfig SearchRoom(string roomId)
    {
      var result = _roomList.FirstOrDefault(x => x.RoomId == roomId);

      if (result != null)
      {
        return result;
      }
      else
      {
        return null;
      }
    }
  }
}