using GuessWhoIam.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GuessWhoIam.Services
{
  public class HallSignalRHubService : Hub
  {
    private readonly RoomList _roomList;

    public HallSignalRHubService(RoomList roomList)
    {
      _roomList = roomList;
    }

    public override async Task OnConnectedAsync()
    {

      await Clients.All.SendAsync("GetRoomList", _roomList.GetRooms());

      await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
      await base.OnDisconnectedAsync(exception);
    }

    public async Task CreateRoom(string roomId)
    {
      var room = new RoomConfig
      {
        RoomId = roomId,
        Room = new PlayerList()
      };

      _roomList.AddRoom(room);

      await Clients.All.SendAsync("GetRoomList", _roomList.GetRooms());
    }

    public async Task AddToRoom(string roomId)
    {
      var room = _roomList.GetRooms().FirstOrDefault(x => x.RoomId == roomId);

      await Clients.All.SendAsync("GetRoomList", _roomList.GetRooms());
    }

    public async Task UpdateRoomInfo()
    {
      await Clients.All.SendAsync("GetRoomList", _roomList.GetRooms());
    }
  }


}
