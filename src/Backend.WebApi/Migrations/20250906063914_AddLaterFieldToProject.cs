using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AddLaterFieldToProject : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Later",
                table: "Projects",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Later",
                table: "Projects");
        }
    }
}
