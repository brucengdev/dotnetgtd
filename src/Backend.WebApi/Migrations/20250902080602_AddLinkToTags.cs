using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AddLinkToTags : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_ItemTagMappings_ItemId",
                table: "ItemTagMappings",
                column: "ItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_ItemTagMappings_Items_ItemId",
                table: "ItemTagMappings",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ItemTagMappings_Items_ItemId",
                table: "ItemTagMappings");

            migrationBuilder.DropIndex(
                name: "IX_ItemTagMappings_ItemId",
                table: "ItemTagMappings");
        }
    }
}
