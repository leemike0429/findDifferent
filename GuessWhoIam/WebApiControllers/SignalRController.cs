using GuessWhoIam.Models;
using GuessWhoIam.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static GuessWhoIam.Models.AttackCardsModel;
using static GuessWhoIam.Services.GameSignalRHubService;

namespace GuessWhoIam.WebApiControllers
{
  [Route("api/[controller]/[action]")]
  [ApiController]
  public class SignalRController : ControllerBase
  {
    private readonly IHubContext<GameSignalRHubService> _countHub;

    public SignalRController(IHubContext<GameSignalRHubService> countHub)
    {
      _countHub = countHub;
    }

    [HttpPost]
    public async Task ReduceLife(PlayerModel user)
    {
      await _countHub.Clients.Groups(user.RoomId).SendAsync("ReduceLife", user.Id, user.Life);
    }
    [HttpPost]
    public async Task GetPoint(PlayerModel user)
    {
      await _countHub.Clients.Groups(user.RoomId).SendAsync("GetPoint", user.Id, user.Score);
    }
    [HttpPost]
    public async Task GetBugStatus(PlayerModel bug)
    {
      await _countHub.Clients.Groups(bug.RoomId).SendAsync("GetBugStatus", bug.Id, bug.BugId);
    }
    [HttpPost]
    public async Task Send(PlayerModel msg)
    {
      await _countHub.Clients.Groups(msg.RoomId).SendAsync("GetMsg", msg.Id, msg.Msg);
    }
    [HttpPost]
    public async Task Over(PlayerModel player)
    {
      await _countHub.Clients.Groups(player.RoomId).SendAsync("Over", player.Id);
    }
    [HttpPost]
    public async Task Timer(PlayerModel timer)
    {
      await _countHub.Clients.Groups(timer.RoomId).SendAsync("Timer", timer.Id, timer.Percentage);
    }
    [HttpPost]
    public async Task PrePare(PlayerModel player)
    {
      await _countHub.Clients.Groups(player.RoomId).SendAsync("Prepare", player.Id, player.Status);
    }

    [HttpPost]
    public async Task Attack(Attack attack)
    {
      await _countHub.Clients.Groups(attack.RoomId).SendAsync("Attack", attack.Attacker, attack.Card, attack.Attacked);

    }

  }
}
