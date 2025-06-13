﻿using System.Security.Claims;

namespace chatapp.api.Extenions
{
    public static class ClaimsPrincipleExtenions
    {
        public static string GetUserName(this ClaimsPrincipal user)
        {
            return user.FindFirstValue(ClaimTypes.Name) ?? throw new Exception("Cannot get username");
        }

        public static Guid GetUserId(this ClaimsPrincipal user)
        {
            return Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new Exception("Canoot get userId"));
        }

        













        }



}
