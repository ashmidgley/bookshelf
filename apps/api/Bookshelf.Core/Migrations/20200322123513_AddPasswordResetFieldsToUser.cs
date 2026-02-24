using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Bookshelf.Core.Migrations
{
    public partial class AddPasswordResetFieldsToUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "PasswordResetExpiry",
                table: "Users",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "PasswordResetToken",
                table: "Users",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PasswordResetExpiry",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PasswordResetToken",
                table: "Users");
        }
    }
}
