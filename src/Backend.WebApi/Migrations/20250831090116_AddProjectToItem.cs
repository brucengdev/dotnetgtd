using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AddProjectToItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProjectId",
                table: "Items",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "Items");
        }
    }
}
