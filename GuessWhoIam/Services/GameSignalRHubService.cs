using GuessWhoIam.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GuessWhoIam.Services
{
  public class GameSignalRHubService : Hub
  {
    private static readonly object block = new object();
    private readonly GameConfigList _gameConfigList;
    private readonly RoomList _roomList;
    public GameSignalRHubService(GameConfigList configList, RoomList roomList)
    {
      _gameConfigList = configList;
      _roomList = roomList;
    }

    public override async Task OnConnectedAsync()
    {
      await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
      await base.OnDisconnectedAsync(exception);

      PlayerModel player = new();

      RoomConfig playerRoom = new();


      lock (block)
      {
        var allRoom = _roomList.GetAllRoom();

        foreach (var room in allRoom)
        {
          if (room.PlayerList.GetPlayer(Context.ConnectionId) != null)
          {
            player = room.PlayerList.GetPlayer(Context.ConnectionId);

            if (room.PlayerList.GetList().Contains(player))
            {
              playerRoom = room;
            }
            room.PlayerList.RemovePlayer(Context.ConnectionId);
          }
        }
        _roomList.RemoveRooom();
      }
      string groupName = playerRoom.RoomId;

      await Clients.Group(groupName).SendAsync("UserLeave", player.Id);

      if (playerRoom.PlayerList.GetList().Count != 0)
      {
        await Clients.Group(groupName).SendAsync("GetWaitingUsers", playerRoom.PlayerList.GetList().Select(x => new { id = x.Id }).ToList());
      }
    }

    public async Task Connection(string groupName)
    {
      if (string.IsNullOrEmpty(groupName) || groupName == "undefined")
      {
        throw new Exception("不正常連線");
      }
      RoomConfig room;
      int[] leftList = new int[0];

      lock (block)
      {
        room = _roomList.SearchRoom(groupName);

        if(room == null)
        {
          room = new RoomConfig();
        } 
        else if (room.PlayerList.GetList().Count <= 4)
        {
          leftList = room.PlayerList.GetLeftList();
        }
        else
        {
          throw new Exception("人數已滿");
        }
      }

      await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

      await Clients.Group(groupName).SendAsync("GetLeftList", leftList);
    }

    public async Task RecordPlayer(string groupName,int id)
    {
      if (string.IsNullOrEmpty(groupName) || groupName == "undefined")
      {
        throw new Exception("不正常連線");
      }
      RoomConfig room;
      PlayerModel player = new();

      lock (block)
      {
        room = _roomList.SearchRoom(groupName);

        if (room != null)
        {
          player.ConnectId = Context.ConnectionId;
          player.Id = id;
          room.PlayerList.AddPlayer(player);
        }
      }
      await Clients.Group(groupName).SendAsync("UserJoin",id);

      await Clients.Group(groupName).SendAsync("GetWaitingUsers", room.PlayerList.GetList().Select(x => new { id = x.Id }).ToList());
  }

    public async Task StartGame(string groupName)
    {
      var config = _gameConfigList.GetGameConfig(groupName);

      await Clients.Group(groupName).SendAsync("StartGame", new { roomId = config.RoomId, themeId = config.ThemeId, topicIndex = config.TopicIndex, cardList = config.CardList });
    }
  }
}
