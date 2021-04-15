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

      var allRoom = _roomList.GetAllRoom();

      PlayerModel player = new();

      RoomConfig playerRoom = new();


      lock (block)
      {
        foreach (var room in allRoom)
        {
          if (room.Room.GetPlayer(Context.ConnectionId) != null)
          {
            player = room.Room.GetPlayer(Context.ConnectionId);

            if (room.Room.GetList().Contains(player))
            {
              playerRoom = room;
            }
            room.Room.RemoveList(Context.ConnectionId);
          }
        }
        _roomList.RemoveRooom();
      }
      string groupName = playerRoom.RoomId;

      await Clients.Group(groupName).SendAsync("UserLeave", player.Id);

      if (playerRoom.Room.GetList().Count != 0)
      {
        await Clients.Group(groupName).SendAsync("GetWaitingUsers", playerRoom.Room.GetList().Select(x => new { id = x.Id }).ToList());
      }
    }

    public async Task Connection(string groupName, int? index)
    {
      if (string.IsNullOrEmpty(groupName) || groupName == "undefined" || index == null)
      {
        throw new Exception("不正常連線");
      }

      var player = new PlayerModel
      {
        ConnectId = Context.ConnectionId,
        Id = (int)index
      };

      var room = _roomList.SearchRoom(groupName);

      if (room == null)
      {
        throw new Exception("連線異常");
      }
      lock (block)
      {
        room.Room.AddList(player);
      }

      await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

      await Clients.Group(groupName).SendAsync("UserJoin", (int)index);

      await Clients.Group(groupName).SendAsync("GetWaitingUsers", room.Room.GetList().Select(x => new { id = x.Id }).ToList());
    }

    public async Task StartGame(string groupName)
    {
      var config = _gameConfigList.GetGameConfig(groupName);

      await Clients.Group(groupName).SendAsync("StartGame", new { roomId = config.RoomId, themeId = config.ThemeId, topicIndex = config.TopicIndex, cardList = config.CardList });
    }
  }
}
