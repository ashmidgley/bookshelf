using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Bookshelf.Core.Migrations
{
    public partial class UpdateBookModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Removed",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "StartedOn",
                table: "Books");

            migrationBuilder.RenameColumn(
                name: "Image",
                table: "Books",
                newName: "ImageUrl");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImageUrl",
                table: "Books",
                newName: "Image");

            migrationBuilder.AddColumn<bool>(
                name: "Removed",
                table: "Books",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartedOn",
                table: "Books",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
